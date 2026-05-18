---
title: 'Windows下安装OpenCode并配置oh-my-openagent和superpowers'
date: '2026-05-18'
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

## 二、配置Shell（解决PowerShell下bash命令不兼容问题）

OpenCode生成的指令默认使用bash语法（如`&&`、`set VAR=value`等），但Windows自带的PowerShell 5.1并不支持`&&`操作符，直接执行会报错：

```
&& 运算符在此版本的 PowerShell 中无效
```

### 解决方法：配置Git Bash

如果你已经安装了Git for Windows（大概率已装），自带的Git Bash可以直接在OpenCode中使用。

有两种配置方式：

#### 方式一：全局配置（推荐）

在OpenCode全局配置文件`%APPDATA%\opencode\opencode.json`中添加`shell`字段：

```json
{
  "shell": "C:\\Program Files\\Git\\bin\\bash.exe"
}
```

添加后全局生效，所有项目都能使用bash执行命令。

#### 方式二：项目级配置

在项目根目录新建`opencode.json`（如已有则直接编辑），同样添加`shell`字段：

```json
{
  "shell": "C:\\Program Files\\Git\\bin\\bash.exe"
}
```

项目级配置会覆盖全局配置，适合不同项目使用不同终端的情况。

### 验证

重启OpenCode后，shell命令就会通过Git Bash执行，`&&`、`set`、`>`等bash语法全部正常。

### 其他方案

- **使用WSL**：WSL里是原生Linux bash，不存在兼容问题，也是OpenCode官方推荐的方式
- **升级PowerShell 7+**：PS7支持`&&`操作符，但`set VAR=value`这类bash赋值语法仍需留意

## 三、安装Bun

oh-my-openagent的安装推荐使用bun，先安装bun：

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

安装完成后验证：

```bash
bun --version
```

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

   全局配置文件位于用户目录下的`%APPDATA%\opencode\opencode.json`（即`C:\Users\你的用户名\AppData\Roaming\opencode\opencode.json`）

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

## 六、配置LLM提供商

OpenCode支持多种LLM提供商，首次运行时会引导配置。你可以：

- **免费模型**：直接选择免费模型无需API Key
- **自带API Key**：配置OpenAI、Anthropic、Google等提供商的API Key
- **ChatGPT Plus**：配置浏览器Cookie使用ChatGPT Plus额度

配置方式在`opencode.json`中添加provider：

```json
{
  "provider": {
    "openai": {
      "apiKey": "sk-xxx"
    }
  }
}
```

## 七、OpenCode常用命令

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

## 八、常用功能一览

### oh-my-openagent核心功能

| 功能 | 说明 |
|------|------|
| `ulw` / `ultrawork` | 一键激活所有代理，不完成不罢休 |
| `/start-work` | Prometheus规划器，先访谈再执行 |
| `/init-deep` | 自动生成项目层级AGENTS.md文件 |
| Team Mode | 多代理并行协作，实时可视化 |

### superpowers内置技能

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
2. **模型选择**：oh-my-openagent会自动根据任务类型选择最优模型，无需手动切换
3. **插件冲突**：如果同时安装了多个插件，注意配置不要有冲突
4. **API费用**：使用付费模型会产生API费用，建议先用免费模型测试

## 总结

整个安装配置流程：

```
安装OpenCode → 配置Shell为Git Bash → 安装Bun →
bunx oh-my-openagent install → 配置opencode.json添加superpowers → 重启验证
```

配置完成后你就拥有了一个强大的终端AI开发环境，可以享受纪律代理编排、团队并行开发、浏览器自动化等一系列高级功能。
