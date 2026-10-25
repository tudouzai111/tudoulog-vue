---
title: '一次内核级内存泄漏排查实录：16GB内存被吃掉13GB，元凶竟是Realtek音频驱动'
date: '2026-04-26'
tags: [ 'Windows', '日常' ]
excerpt: '具体情况是突然电脑卡顿，内存占用99%，系统磁盘100%，CPU正常，任务管理器进程列表看不出谁占内存，重启无效'
coverImage: 'win11bug.webp'
---

> 文章使用AI润色

## 问题现象

- 笔记本挂机黑屏唤醒后**极度卡顿**
- 任务管理器显示：**内存占用99%、磁盘100%**，但进程列表看不出哪个程序占用高
- CPU占用极低
- 重启后问题依旧

  ![win11bug1.png](/img/win11bug1.webp)

## 查找元凶

## RAMMap

发现非分页池（Nonpaged Pool）高达 **13GB**（共16GB内存）可以知道是内核级内存泄漏问题

![win11bug2.png](/img/win11bug2.webp)

## PoolMon

打开PoolMon后<br/>
按P键：筛选只显示“Nonp” (Nonpaged pool, 非分页池) 的数据，多按几次直到Type列显示为 Nonp 为止。<br/>
按B键：这会让所有结果按 Bytes 从大到小排列，让内存最大的排在最顶部，可以多按几次

然后发现 Tag **`RTLF`** 占用了约 **10GB**，元凶是 **Realtek 音频驱动**

![win11bug3.png](/img/win11bug3.webp)

## 根本原因

- Windows 下载并尝试安装 **KB5083769**（安全更新），但**安装失败**
- 这次失败的更新过程，**破坏了系统环境或触发了驱动冲突**，导致这两个 Realtek 驱动疯狂泄漏内存
- 注意：KB5083769 **实际上并未成功安装**

## 解决过程

| 操作过程                 | 结果                    |
|----------------------|-----------------------|
| 禁用两个 Realtek 驱动并重启   | 内存恢复正常，电脑不卡了但是内置扬声器无声 |
| 暂停 Windows 更新        | KB5083769停止安装         |
| 重新启用两个 Realtek 驱动并重启 | 内存、磁盘都正常，声音也回来了       |
| 启用WUB                | Windows系统更新永久停止       |

> **关键发现**：问题不是驱动，而是**更新过程中的某些临时状态或残留文件“污染”了系统**
> 当暂停更新并重启，那个冲突状态被清除了，驱动就能正常工作。

## 总结

- 使用 **WUB（Windows Update Blocker）** 工具**永久暂停更新**
- 停止更新的系统才是最好的系统

## 附录

RAMMap的下载链接：https://learn.microsoft.com/en-us/sysinternals/downloads/rammap<br/>
PoolMon的下载安装以及使用方法（转自腾讯云开发者社区）：https://cloud.tencent.com/developer/article/1871416<br/>
WUB的下载链接：https://caiyun.139.com/w/i/2uETMPyeDHo6h `提取码:s7fk`
