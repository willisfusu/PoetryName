# GetPoetryName（你的名字）

基于中国古典诗文的 AI 起名工具。

> 本项目为二次开发版本，基础灵感与早期实现来自：
> [holynova/gushi_namer](https://github.com/holynova/gushi_namer)

## 项目来源

- 原始项目：`holynova/gushi_namer`
- 当前项目：在原思路上重构为 **Svelte 5 + TypeScript + Vite**，并加入多 AI 服务商配置、生成反馈动画与更完整的候选展示流程。

## 功能特性

- 支持诗文库：诗经、楚辞、唐诗、宋词、乐府诗集、古诗三百首、著名辞赋
- 支持自定义诗文输入（优先于内置诗文库）
- 基于 AI 生成候选名字（默认每次生成 10 个）
- 候选展示包含：名字、诗句摘录、命名理由、来源参考信息
- 支持“再来一组”（会尽量避开已生成名字）
- 支持 AI 服务商配置：默认代理 / Anthropic / OpenAI / 自定义
- 生成配置（API Key、服务商、模型等）保存在浏览器 `localStorage`

## 技术栈

- Svelte 5
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- bits-ui、lucide-svelte、GSAP

## 快速开始

### 1) 安装依赖

```bash
npm install
```

### 2) 启动开发环境

```bash
npm run dev
```

### 3) 构建生产版本

```bash
npm run build
```

### 4) 本地预览构建结果

```bash
npm run preview
```

## 常用脚本

```bash
npm run dev       # 本地开发
npm run build     # 生产构建（输出 dist/）
npm run preview   # 预览构建产物
npm run check     # Svelte + TypeScript 检查
npm run lint      # 代码检查
npm run lint:fix  # 自动修复部分 lint 问题
npm run format    # Prettier 格式化
```

## 使用说明

1. 打开页面，点击右上角「设置」。
2. 选择 AI 服务商并填写 API Key（建议同时确认模型名）。
3. 可选：切换诗文库，或输入自定义诗文。
4. 输入姓氏后点击「AI 起名」。
5. 在候选卡片中选择你喜欢的名字，或点击「再来一组」。

## 目录结构

```text
src/
  App.svelte
  lib/
    ai.ts                 # AI 请求与响应解析
    ai-config.ts          # localStorage 配置读写
    config.ts             # 常量与服务商预设
    namer.ts              # 诗文加载与基础名字处理
    components/           # UI 组件
public/
  json/                   # 诗文语料库
dist/                     # 构建输出
```

## 数据与隐私

- 诗文语料位于 `public/json/`，会随前端静态资源一起发布。
- API Key 与服务商配置仅保存在浏览器 `localStorage`。
- AI 请求会发送到你配置的服务商端点，请根据你的服务商政策自行评估安全性。

## 致谢

- 原项目与创意来源：
  [holynova/gushi_namer](https://github.com/holynova/gushi_namer)

欢迎 Star、Fork、Issue 和 PR。✨
