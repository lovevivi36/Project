# 欢迎使用你的秒哒应用代码包
秒哒应用链接
    URL:https://www.miaoda.cn/projects/app-8y97oxlqhqtd

# DopaList 桌面应用

极简待办事项管理应用，融合多巴胺奖励机制

## 功能特性

- ✅ 任务管理：添加、编辑、删除、完成任务
- 🎯 优先级设置：P1、P2、P3 三级优先级
- 📅 截止日期：设置任务截止时间
- 📁 类别管理：自定义任务类别，按类别组织任务
- 🎁 多巴胺奖励：完成任务随机触发奖励机制
- 🎨 极简设计：黑白灰主色调，线性设计风格
- 💾 本地存储：所有数据保存在本地，无需联网

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 组件**: shadcn/ui + Radix UI
- **样式**: Tailwind CSS
- **动画**: Motion (Framer Motion)
- **桌面框架**: Electron
- **构建工具**: Vite + electron-builder

## 开发和运行

### 环境要求

```bash
Node.js ≥ 20
npm ≥ 10
pnpm ≥ 8
```

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动 Web 开发模式（浏览器）
pnpm dev

# 启动 Electron 开发模式（桌面应用 + 热重载）
pnpm electron:dev
```

### 构建桌面应用

```bash
# 构建当前平台的应用
pnpm electron:build

# 构建 Windows 应用
pnpm electron:build:win

# 构建 macOS 应用
pnpm electron:build:mac

# 构建 Linux 应用
pnpm electron:build:linux
```

构建完成后，安装包将生成在 `release` 目录中。

## 安装和使用

### Windows

1. 运行 `pnpm electron:build:win` 构建应用
2. 在 `release` 目录找到 `DopaList Setup x.x.x.exe`
3. 双击安装程序，按提示完成安装
4. 安装完成后，从桌面或开始菜单启动 DopaList

### macOS

1. 运行 `pnpm electron:build:mac` 构建应用
2. 在 `release` 目录找到 `DopaList-x.x.x.dmg`
3. 双击 DMG 文件，将 DopaList 拖到应用程序文件夹
4. 从启动台或应用程序文件夹启动 DopaList

### Linux

1. 运行 `pnpm electron:build:linux` 构建应用
2. 在 `release` 目录找到 `DopaList-x.x.x.AppImage` 或 `.deb` 文件
3. AppImage：添加执行权限后直接运行 `chmod +x DopaList-x.x.x.AppImage && ./DopaList-x.x.x.AppImage`
4. DEB：使用包管理器安装 `sudo dpkg -i DopaList-x.x.x.deb`

## 数据存储

所有数据（任务、类别、奖励库）都存储在浏览器的 localStorage 中，完全本地化，无需担心隐私泄露。

## 快捷键

- `Ctrl/Cmd + Q`: 退出应用
- `Ctrl/Cmd + R`: 重新加载
- `Ctrl/Cmd + 0`: 重置缩放
- `Ctrl/Cmd + Plus`: 放大
- `Ctrl/Cmd + Minus`: 缩小
- `F11`: 全屏切换
- `F12`: 开发者工具（开发模式）

## 目录结构

```
├── README.md                 # 说明文档
├── electron/                 # Electron 主进程代码
│   └── main.js              # Electron 入口文件
├── src/                     # 源码目录
│   ├── components/          # 组件目录
│   ├── pages/              # 页面目录
│   ├── types/              # 类型定义
│   ├── utils/              # 工具函数
│   └── index.css           # 全局样式
├── public/                  # 静态资源
├── package.json            # 项目配置
├── vite.config.ts          # Vite 配置
└── tsconfig.json           # TypeScript 配置
```

## 许可证

MIT License

---

© 2026 DopaList Team
