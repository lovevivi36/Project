# DopaList 项目总结

## 📱 应用简介

DopaList 是一款极简风格的待办事项管理桌面应用，融合多巴胺奖励机制，帮助用户高效完成任务的同时获得意外惊喜。

## ✨ 核心功能

### 1. 任务管理
- ✅ 添加、编辑、删除任务
- 🎯 三级优先级（P1/P2/P3）
- 📅 截止日期设置
- 📝 子任务支持
- 🗑️ 回收站功能

### 2. 类别管理
- 📁 自定义任务类别
- 🎨 6种预设颜色
- 🔄 类别编辑和删除
- 🏷️ 按类别筛选任务
- 📊 类别任务数量统计

### 3. 多巴胺奖励系统
- 🎁 完成任务随机触发奖励
- 🎉 60% 正常完成
- ⭐ 30% 小奖励（Toast提示）
- 🎊 10% 超级大奖（五彩纸屑）
- ✏️ 自定义奖励文案和权重

### 4. 数据管理
- 💾 本地存储（localStorage）
- 📤 导出为Excel
- 🔄 数据恢复（回收站）
- 🔒 完全私密安全

### 5. 界面特性
- 🎨 极简黑白灰设计
- 📱 响应式布局（PC + 移动端）
- 🌓 深色模式支持
- ✨ 流畅动画效果
- ⌨️ 快捷键支持

## 🛠️ 技术栈

- **前端**: React 18 + TypeScript
- **UI**: shadcn/ui + Radix UI + Tailwind CSS
- **动画**: Motion (Framer Motion)
- **桌面**: Electron
- **构建**: Vite + electron-builder
- **状态**: React Hooks + Context
- **存储**: localStorage

## 📂 项目结构

```
DopaList/
├── electron/                    # Electron 主进程
│   └── main.js                 # 应用入口
├── src/                        # 源代码
│   ├── components/             # 组件
│   │   ├── ui/                # UI基础组件
│   │   ├── TaskInput.tsx      # 任务输入
│   │   ├── TaskItem.tsx       # 任务项
│   │   ├── TaskList.tsx       # 任务列表
│   │   ├── CategoryManager.tsx # 类别管理
│   │   ├── RewardDialog.tsx   # 奖励弹窗
│   │   └── RewardEditor.tsx   # 奖励编辑
│   ├── pages/                 # 页面
│   │   └── HomePage.tsx       # 主页
│   ├── types/                 # 类型定义
│   │   └── task.ts           # 任务类型
│   ├── utils/                 # 工具函数
│   │   ├── localStorage.ts   # 存储工具
│   │   ├── rewards.ts        # 奖励逻辑
│   │   ├── audio.ts          # 音效管理
│   │   └── date.ts           # 日期工具
│   └── index.css             # 全局样式
├── public/                     # 静态资源
├── release/                    # 构建输出（自动生成）
├── start.sh                    # Linux/Mac启动脚本
├── start.bat                   # Windows启动脚本
├── README.md                   # 项目说明
├── USAGE.md                    # 使用指南
├── QUICK_START.md             # 快速启动
└── package.json               # 项目配置
```

## 🚀 使用方式

### 方式一：快速启动（推荐）

**Windows**: 双击 `start.bat`
**Mac/Linux**: 运行 `./start.sh`

### 方式二：命令行

```bash
# 开发模式
pnpm install
pnpm electron:dev

# 构建应用
pnpm electron:build:win    # Windows
pnpm electron:build:mac    # macOS
pnpm electron:build:linux  # Linux
```

## 📦 构建产物

构建完成后，在 `release/` 目录找到：

- **Windows**: `DopaList Setup 1.0.0.exe` (NSIS安装包)
- **macOS**: `DopaList-1.0.0.dmg` (DMG镜像)
- **Linux**: `DopaList-1.0.0.AppImage` 或 `.deb` (可执行文件/安装包)

## 🎯 设计理念

1. **极简主义**: 黑白灰配色，线性设计，去除冗余元素
2. **高效交互**: 快捷键支持，一键操作，流畅动画
3. **正向激励**: 多巴胺奖励机制，让完成任务更有趣
4. **隐私优先**: 本地存储，无需联网，数据完全私密
5. **跨平台**: 支持 Windows、macOS、Linux

## 📝 开发日志

### 已实现功能
- ✅ 基础任务管理（增删改查）
- ✅ 优先级和截止日期
- ✅ 子任务支持
- ✅ 类别管理系统
- ✅ 多巴胺奖励机制
- ✅ 回收站功能
- ✅ 数据导出（Excel）
- ✅ 响应式设计
- ✅ Electron桌面应用
- ✅ 跨平台构建

### 未来计划
- 🔄 云同步功能
- 📊 统计图表
- 🔔 任务提醒
- 🎨 主题自定义
- 🌐 多语言支持
- 📱 移动端应用

## 📄 文档说明

- **README.md**: 项目介绍和技术文档
- **USAGE.md**: 详细使用指南
- **QUICK_START.md**: 快速启动说明
- **PROJECT_SUMMARY.md**: 本文档，项目总结

## 🎉 开始使用

1. 确保安装 Node.js (>= 20)
2. 运行启动脚本或命令
3. 选择开发模式或构建应用
4. 开始管理您的待办事项！

---

© 2026 DopaList Team | MIT License
