# DopaList 快速启动指南

## 🚀 最简单的启动方式

### Windows 用户

双击运行 `start.bat` 文件，按提示选择：
- 选项 1：开发模式（实时预览）
- 选项 2：构建桌面应用

### macOS / Linux 用户

在终端中运行：
```bash
./start.sh
```

按提示选择：
- 选项 1：开发模式（实时预览）
- 选项 2：构建桌面应用

## 📋 手动运行命令

如果您熟悉命令行，可以直接使用以下命令：

### 开发模式
```bash
pnpm install          # 首次运行需要安装依赖
pnpm electron:dev     # 启动开发模式
```

### 构建应用
```bash
# Windows
pnpm electron:build:win

# macOS
pnpm electron:build:mac

# Linux
pnpm electron:build:linux
```

## 📦 安装包位置

构建完成后，安装包在 `release` 目录：
- Windows: `DopaList Setup 1.0.0.exe`
- macOS: `DopaList-1.0.0.dmg`
- Linux: `DopaList-1.0.0.AppImage` 或 `.deb`

## ⚠️ 注意事项

1. 确保已安装 Node.js (>= 20)
2. 首次运行需要安装依赖，可能需要几分钟
3. 构建应用需要较长时间（5-15分钟），请耐心等待

## 🎉 开始使用

安装完成后，从桌面或开始菜单启动 DopaList，开始管理您的待办事项！

详细使用说明请查看 `USAGE.md` 文件。
