---
title: 'Windows下安装OpenCode并配置oh-my-openagent和superpowers'
date: '2026-05-20'
tags: ['AI工具', 'OpenCode', '教程']
excerpt: '从零开始在Windows上安装OpenCode终端AI编码助手，并配置oh-my-openagent和superpowers插件'
coverImage: 'opencode-install.png'
---

> 文章使用AI润色

## 前言

OpenCode是一个开源的终端AI编码助手，支持多种LLM提供商。搭配oh-my-openagent（OmO）和superpowers插件后，可以获得强大的AI开发团队编排能力。本篇记录在Windows下的完整安装配置过程。

官网：https://opencode.ai/zh

官方文档：https://opencode.ai/docs/zh-cn

## 环境要求

- **操作系统**：Windows 10/11
- **Node.js**：>= 20.19.0
- **包管理器**：bun（推荐）/ npm / pnpm
- **终端**：Windows Terminal（推荐）

## 一、安装OpenCode

Windows下有几种安装方式，任选其一：

### 方式一：使用Scoop（推荐）

```bash
scoop install opencode
```

### 方式二：使用Chocolatey

以管理员身份打开PowerShell：

```bash
choco install opencode
```

### 方式三：使用npm

```bash
npm install -g opencode-ai
```

### 方式四：使用WSL（体验最佳）

Windows下使用WSL（Windows Subsystem for Linux）能获得最完整的体验：

```bash
# 在WSL终端中执行
curl -fsSL https://opencode.ai/install | bash
```

### 验证安装

```bash
opencode --version
```

看到版本号即表示安装成功。

## 二、安装Bun

oh-my-openagent的安装推荐使用bun，先安装bun：

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

安装完成后验证：

```bash
bun --version
```

## 三、配置Shell（解决PowerShell下bash命令不兼容问题）

OpenCode生成的指令默认使用bash语法（如`&&`、`set VAR=value`等），但Windows自带的PowerShell 5.1并不支持`&&`操作符，直接执行会报错：

```
&& 运算符在此版本的 PowerShell 中无效
```

### 解决方法：配置Git Bash

如果你已经安装了Git for Windows（大概率已装），自带的Git Bash可以直接在OpenCode中使用。

先把 Git 安装目录下的 bash 配置到环境变量 path 里，如： `D:\software\Git\bin` 

有两种配置方式：

#### 方式一：全局配置（推荐）

在OpenCode全局配置文件`"C:\Users\TuDouZai\.config\opencode\opencode.json"`中添加`shell`字段：

```json
{
  "shell": "bash"
}
```

添加后全局生效，所有项目都能使用bash执行命令。

#### 方式二：项目级配置

在项目根目录新建`opencode.json`（如已有则直接编辑），同样添加`shell`字段：

```json
{
  "shell": "bash"
}
```

项目级配置会覆盖全局配置，适合不同项目使用不同终端的情况。

### 验证

重启OpenCode后，shell命令就会通过Git Bash执行，`&&`、`set`、`>`等bash语法全部正常。

### 其他方案

- **使用WSL**：WSL里是原生Linux bash，不存在兼容问题，也是OpenCode官方推荐的方式
- **升级PowerShell 7+**：PS7支持`&&`操作符，但`set VAR=value`这类bash赋值语法仍需留意

> 其实安装opencode配置好shell后就可以让ai自己来安装插件了

## 四、安装oh-my-openagent

oh-my-openagent（原oh-my-opencode）是一个强大的AI开发代理编排框架，提供纪律代理（Discipline Agents）、团队模式（Team Mode）、Hash锚定编辑、LSP集成等功能。

GitHub地址：[https://github.com/code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)

### 安装命令

```bash
bunx oh-my-openagent install
```

安装过程会自动完成以下操作：
1. 安装插件到OpenCode
2. 配置默认模型和代理
3. 生成项目配置文件（`.opencode/oh-my-openagent.jsonc`）

### 验证oh-my-openagent

在项目根目录运行OpenCode：

```bash
opencode
```

进入TUI后，输入`ulw`（或`ultrawork`），如果正常响应说明安装成功。

## 五、安装superpowers插件

superpowers插件提供了丰富的开发技能，包括Playwright浏览器自动化、Git原子提交、前端UI/UX设计、代码审查等。

### 配置步骤

1. **找到OpenCode配置文件**

   全局配置文件位于 `~/.config/opencode/opencode.json`（即 `C:\Users\你的用户名\.config\opencode\opencode.json`）

2. **添加superpowers插件**

   在`plugins`数组中添加`"superpowers@git+https://github.com/obra/superpowers.git"`：

   ```json
   {
     "plugins": [
       "superpowers@git+https://github.com/obra/superpowers.git"
     ]
   }
   ```

   如果已有其他插件，追加到数组末尾即可：

   ```json
   {
     "plugins": [
       "oh-my-openagent",
       "superpowers@git+https://github.com/obra/superpowers.git"
     ]
   }
   ```

3. **保存文件**

4. **重启OpenCode**

   完全退出当前OpenCode会话，然后重新启动：

   ```bash
   opencode
   ```

### 验证superpowers

在OpenCode中发送：

```
do you have superpowers?
```

如果返回确认有superpowers（列出可用技能等），则表示配置成功。

## 六、配置模型

OpenCode 提供了一套完整的模型配置体系，从全局默认模型到每个子代理的专用模型，均可按需设置。以下配置均基于 OpenCode Zen——OpenCode 内置的免费模型提供商，无需 API Key。

### OpenCode Zen 免费模型

查看所有可用免费模型：

```bash
# 列出 OpenCode Zen 所有可用模型
opencode models opencode
```

常见免费模型：

| 模型 ID | 说明 |
|---------|------|
| `opencode/big-pickle` | 最强免费模型，适合深度推理、架构设计 |
| `opencode/deepseek-v4-flash-free` | DeepSeek V4 Flash（免费版，200K上下文） |
| `opencode/qwen3.6-plus-free` | Qwen 3.6 Plus（免费版） |

> 以上模型均**完全免费**，可按需分配无需担心费用。不同时间免费模型都不一样，要自己查一下！

### 设置 OpenCode 默认模型

在全局配置文件（`~/.config/opencode/opencode.json`）中添加 `model` 字段：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode/deepseek-v4-flash-free",
  "small_model": "opencode/deepseek-v4-flash-free"
}
```

- `model`：主模型，用于编码和复杂任务
- `small_model`：轻量模型，用于标题生成等简单任务。不设置时会自动选择更便宜的模型

### 配置 oh-my-openagent 多 Agent 模型

oh-my-openagent 编排了多个专用子代理，每个代理可以根据任务特点使用不同的模型，在性能和成本之间取得平衡。

配置文件位于 `~/.config/opencode/oh-my-openagent.json`，分为 `agents`（子代理）和 `categories`（任务分类）两部分：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/oh-my-opencode.schema.json",
  "agents": {
    "hephaestus": { "model": "opencode/minimax-m2.5-free" },
    "oracle":      { "model": "opencode/big-pickle" },
    "librarian":   { "model": "opencode/qwen3.6-plus-free" },
    "explore":     { "model": "opencode/qwen3.6-plus-free" },
    "prometheus":  { "model": "opencode/big-pickle" },
    "metis":       { "model": "opencode/qwen3.6-plus-free" },
    "momus":       { "model": "opencode/big-pickle" },
    "multimodal-looker": { "model": "opencode/qwen3.6-plus-free" },
    "atlas":       { "model": "opencode/nemotron-3-super-free" },
    "sisyphus-junior": { "model": "opencode/deepseek-v4-flash-free" }
  },
  "categories": {
    "visual-engineering": { "model": "opencode/qwen3.6-plus-free" },
    "ultrabrain":         { "model": "opencode/big-pickle" },
    "deep":               { "model": "opencode/big-pickle" },
    "artistry":           { "model": "opencode/deepseek-v4-flash-free" },
    "quick":              { "model": "opencode/qwen3.6-plus-free" },
    "unspecified-low":    { "model": "opencode/qwen3.6-plus-free" },
    "unspecified-high":   { "model": "opencode/minimax-m2.5-free" },
    "writing":            { "model": "opencode/qwen3.6-plus-free" }
  }
}
```

#### Agent 分工与推荐模型

| Agent | 职责 | 推荐模型 |
|-------|------|---------|
| `hephaestus` | 执行代理，处理具体编码任务 | `minimax-m2.5-free` |
| `oracle` | 高IQ顾问，架构/调试难题 | `big-pickle`（强模型） |
| `librarian` | 搜索外部文档和代码示例 | `qwen3.6-plus-free` |
| `explore` | 搜索代码库结构和模式 | `qwen3.6-plus-free` |
| `prometheus` | 任务规划和分解 | `big-pickle`（强模型） |
| `metis` | 需求分析，识别模糊点 | `qwen3.6-plus-free` |
| `momus` | 审查计划，发现遗漏 | `big-pickle`（强模型） |
| `sisyphus-junior` | 执行委派的具体子任务 | `deepseek-v4-flash-free` |

#### Category 分工与推荐模型

| Category | 适用场景 | 推荐模型 |
|----------|---------|---------|
| `visual-engineering` | 前端UI/UX、样式、动画 | `qwen3.6-plus-free` |
| `ultrabrain` | 复杂逻辑、架构决策 | `big-pickle`（强模型） |
| `deep` | 深度研究 + 端到端实现 | `big-pickle`（强模型） |
| `artistry` | 创意类、非常规方案 | `deepseek-v4-flash-free` |
| `quick` | 简单修改、修 typo | `qwen3.6-plus-free` |
| `writing` | 文档、技术写作 | `qwen3.6-plus-free` |

#### 配置思路

合理分配模型的核心原则：

- **高推理需求**（oracle、prometheus、momus、ultrabrain、deep）→ 用 `big-pickle` 等强模型，保证输出质量
- **高频搜索**（explore、librarian）→ 用 `qwen3.6-plus-free`，速度快 token 消耗大但免费
- **视觉/前端**（visual-engineering）→ `qwen3.6-plus-free` 或更强模型
- **简单任务**（quick、unspecified-low）→ 最便宜的模型即可

### 配置优先级

模型选择遵循以下优先级（从上到下递减）：

| 优先级 | 配置方式 | 说明 |
|--------|---------|------|
| 1 | `opencode -m provider/model` | 命令行参数，临时切换 |
| 2 | 项目根目录的 `opencode.json` | 项目级配置，覆盖全局 |
| 3 | `~/.config/opencode/opencode.json` | 全局配置，用户偏好 |
| 4 | 最近使用的模型 | OpenCode 自动记住 |
| 5 | 内置默认 | 兜底 |

### 验证配置

启动 OpenCode 后输入 `/models`，查看当前使用的模型，确认显示为目标模型 ID。

## 七、常用命令与功能

### OpenCode 内置命令

进入OpenCode的TUI后，直接输入斜杠命令即可调用：

| 命令 | 说明 |
|------|------|
| `/init` | 初始化项目或配置文件 |
| `/connect` | 连接或切换LLM提供商 |
| `/models` | 查看和选择可用模型 |
| `/session` | 会话管理（列表、查看、搜索历史会话） |
| `/themes` | 切换TUI主题 |
| `/editor` | 在编辑器中打开当前文件 |
| `/export` | 导出当前会话内容 |
| `/refactor` | 智能重构（LSP + AST-grep + TDD验证） |
| `/review` | 代码审查 |
| `/handoff` | 生成上下文摘要，用于跨会话继续工作 |
| `/start-work` | 从Prometheus规划开始执行任务 |
| `/hyperplan` | 多代理对抗式规划（5个代理交叉评审） |
| `/ralph-loop` | 启动自我反馈循环，持续优化直到完成 |
| `/ulw-loop` | 启动ultrawork循环，不完成不停止 |
| `/remove-ai-slops` | 移除代码中的AI风格代码 |
| `/cancel-ralph` | 取消正在运行的Ralph Loop |
| `/stop-continuation` | 停止所有持续执行机制 |
| `/init-deep` | 自动生成项目层级AGENTS.md知识库 |

> **提示**：输入 `/` 后按 Tab 可以看到当前可用的所有命令列表。

### oh-my-openagent 核心功能

| 功能 | 说明 |
|------|------|
| `ulw` / `ultrawork` | 一键激活所有代理，不完成不罢休 |
| `/start-work` | Prometheus规划器，先访谈再执行 |
| `/init-deep` | 自动生成项目层级AGENTS.md文件 |
| Team Mode | 多代理并行协作，实时可视化 |

### superpowers 内置技能

| 技能 | 用途 |
|------|------|
| `brainstorming` | 创意工作前的需求探索和设计 |
| `systematic-debugging` | 系统化的bug调试流程 |
| `test-driven-development` | TDD测试驱动开发 |
| `git-master` | Git原子提交、变基、历史搜索 |
| `playwright` | 浏览器自动化（验证、测试、爬虫） |
| `frontend-ui-ux` | 前端UI/UX设计开发 |
| `verification-before-completion` | 完成任务前自动验证 |
| `writing-plans` | 编写实施计划 |
| `dispatching-parallel-agents` | 并行分发独立任务 |

## 注意事项

1. **Windows原生 vs WSL**：OpenCode官方推荐Windows用户使用WSL获得最佳体验，因为部分shell工具（如ripgrep、git工具链）在WSL下工作更顺畅
2. **插件冲突**：如果同时安装了多个插件，注意配置不要有冲突
3. **配置文件位置**：OpenCode的全局配置文件为 `~/.config/opencode/opencode.json`，oh-my-openagent的配置文件为 `~/.config/opencode/oh-my-openagent.json`，两者各自独立
4. **模型选择**：oh-my-openagent 会自动根据任务类型选择对应的 category 模型，无需手动切换。如需调整，修改 `oh-my-openagent.json` 即可
5. **OpenCode Zen 免费模型需要联网**，离线环境下无法使用

## 总结

整个安装配置流程：

```
安装OpenCode → 安装Bun → 配置Shell为Git Bash →
安装oh-my-openagent → 添加superpowers插件 → 配置默认模型与多Agent模型
```

配置完成后你就拥有了一个强大的终端AI开发环境，可以享受纪律代理编排、团队并行开发、浏览器自动化等一系列高级功能，且所有模型均为免费，无需担心API费用。
