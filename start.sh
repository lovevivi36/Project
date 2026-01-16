#!/bin/bash

echo "======================================"
echo "   DopaList 桌面应用 - 快速启动"
echo "======================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到 Node.js"
    echo "请先安装 Node.js (>= 20): https://nodejs.org/"
    exit 1
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  未检测到 pnpm，正在安装..."
    npm install -g pnpm
fi

echo "✅ 环境检查通过"
echo ""

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    pnpm install
    echo ""
fi

echo "请选择运行模式："
echo "1) 开发模式（支持热重载）"
echo "2) 构建桌面应用"
echo ""
read -p "请输入选项 (1 或 2): " choice

case $choice in
    1)
        echo ""
        echo "🚀 启动开发模式..."
        pnpm electron:dev
        ;;
    2)
        echo ""
        echo "请选择构建平台："
        echo "1) Windows"
        echo "2) macOS"
        echo "3) Linux"
        echo "4) 当前平台"
        echo ""
        read -p "请输入选项 (1-4): " platform
        
        case $platform in
            1)
                echo "🔨 构建 Windows 应用..."
                pnpm electron:build:win
                ;;
            2)
                echo "🔨 构建 macOS 应用..."
                pnpm electron:build:mac
                ;;
            3)
                echo "🔨 构建 Linux 应用..."
                pnpm electron:build:linux
                ;;
            4)
                echo "🔨 构建当前平台应用..."
                pnpm electron:build
                ;;
            *)
                echo "❌ 无效选项"
                exit 1
                ;;
        esac
        
        echo ""
        echo "✅ 构建完成！"
        echo "📁 安装包位置: ./release/"
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac
