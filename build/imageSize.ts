import { readFileSync } from 'node:fs'

/**
 * 零依赖读取图片固有尺寸（PNG / JPEG / WebP），只解析文件头，不引入 sharp
 * （sharp 是异步 API，而 markdown 渲染管线是同步的）。
 * 用途：构建期为 markdown 图片注入 width/height 属性，浏览器下载前就能锁定占位。
 * 解析失败一律返回 null（构建侧按"无尺寸"跳过，绝不因此中断构建）。
 */
export interface ImageSize {
  width: number
  height: number
}

export function readImageSize(path: string): ImageSize | null {
  try {
    const buf = readFileSync(path)
    // PNG：8 字节签名 + 首个 chunk 必为 IHDR，宽高是偏移 16 / 20 的两个 uint32 大端
    if (
      buf[0] === 0x89 &&
      buf.subarray(1, 4).toString('latin1') === 'PNG' &&
      buf.subarray(12, 16).toString('latin1') === 'IHDR'
    ) {
      if (buf.length < 24) return null
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
    }
    // WebP：RIFF 容器 + WEBP 标记，按首个 chunk 分别处理三种编码
    if (
      buf.subarray(0, 4).toString('latin1') === 'RIFF' &&
      buf.subarray(8, 12).toString('latin1') === 'WEBP'
    ) {
      return webpSize(buf)
    }
    // JPEG：从 SOI 开始扫段标记，尺寸由 SOF 携带
    if (buf[0] === 0xff && buf[1] === 0xd8) return jpegSize(buf)
    return null
  } catch {
    return null
  }
}

function webpSize(buf: Buffer): ImageSize | null {
  const format = buf.subarray(12, 16).toString('latin1')
  switch (format) {
    case 'VP8 ': {
      // 有损压缩：帧头跳过 3 字节帧标签，0x9d 0x01 0x2a 同步码后是"宽/高"两个 16bit
      // 小端值：低 14 位是像素值（与 VP8L/VP8X 的"-1 存储法"不同，不加 1，已对着
      // 浏览器实测宽度逐字节校验），高 2 位是缩放模式（转制图不缩放，掩码照做）
      if (buf.length < 30) return null
      if (buf[23] !== 0x9d || buf[24] !== 0x01 || buf[25] !== 0x2a) return null
      return {
        width: buf.readUInt16LE(26) & 0x3fff,
        height: buf.readUInt16LE(28) & 0x3fff,
      }
    }
    case 'VP8L': {
      // 无损：0x2f 签名后的 32bit 里 14bit（宽-1）+ 14bit（高-1）
      if (buf.length < 25 || buf[20] !== 0x2f) return null
      const bits = buf.readUInt32LE(21)
      return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 }
    }
    case 'VP8X': {
      // 扩展格式：flags + 3 字节保留后是 24bit 的（宽-1）与（高-1）
      if (buf.length < 30) return null
      return {
        width: readUInt24LE(buf, 24) + 1,
        height: readUInt24LE(buf, 27) + 1,
      }
    }
    default:
      return null
  }
}

function readUInt24LE(buf: Buffer, offset: number): number {
  return buf[offset]! | (buf[offset + 1]! << 8) | (buf[offset + 2]! << 16)
}

function jpegSize(buf: Buffer): ImageSize | null {
  let pos = 2 // 跳过 SOI（FF D8），后续每段由连续 0xff + 标记字节组成
  while (pos < buf.length) {
    // 吞掉连续 0xff 填充，落在标记字节本身
    while (pos < buf.length && buf[pos] === 0xff) pos++
    if (pos >= buf.length) return null
    const marker = buf[pos]!
    if (marker === 0xd9) return null // EOI：扫完没遇到 SOF
    // SOF0-SOF15（排除 C4 DHT / C8 JPG / CC DAC）携带尺寸：
    // 标记后紧跟段长(2B) + 精度(1B) + 高(2B BE) + 宽(2B BE)
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      if (pos + 7 >= buf.length) return null
      return { width: buf.readUInt16BE(pos + 6), height: buf.readUInt16BE(pos + 4) }
    }
    // 无长度字段的独立标记（TEM / RST0-7 / 再次出现的 SOI）：仅 1 字节，落到下一段
    if (marker === 0x01 || marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) {
      pos += 1
      continue
    }
    // 其余段：标记后的 2 字节大端段长（含自身），整段跳过（pos 落在下一段的 0xff 上）
    if (pos + 2 >= buf.length) return null
    const len = buf.readUInt16BE(pos + 1)
    if (len < 2) return null // 长度异常，防死循环
    pos += 1 + len
  }
  return null
}
