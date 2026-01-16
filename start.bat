@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ======================================
echo    DopaList 桌面应用 - 快速启动
echo ======================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误：未检测到 Node.js
    echo 请先安装 Node.js ^(^>= 20^): https://nodejs.org/
    pause
    exit /b 1
)

REM 检查 pnpm
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  未检测到 pnpm，正在安装...
    call npm install -g pnpm
)

echo ✅ 环境检查通过
echo.

REM 检查依赖
if not exist "node_modules" (
    echo 📦 正在安装依赖...
    call pnpm install
    echo.
)

echo 请选择运行模式：
echo 1^) 开发模式（支持热重载）
echo 2^) 构建桌面应用
echo.
set /p choice="请输入选项 (1 或 2): "

if "%choice%"=="1" (
    echo.
    echo 🚀 启动开发模式...
    call pnpm electron:dev
) else if "%choice%"=="2" (
    echo.
    echo 请选择构建平台：
    echo 1^) Windows
    echo 2^) macOS
    echo 3^) Linux
    echo 4^) 当前平台
    echo.
    set /p platform="请输入选项 (1-4): "
    
    if "!platform!"=="1" (
        echo 🔨 构建 Windows 应用...
        call pnpm electron:build:win
    ) else if "!platform!"=="2" (
        echo 🔨 构建 macOS 应用...
        call pnpm electron:build:mac
    ) else if "!platform!"=="3" (
        echo 🔨 构建 Linux 应用...
        call pnpm electron:build:linux
    ) else if "!platform!"=="4" (
        echo 🔨 构建当前平台应用...
        call pnpm electron:build
    ) else (
        echo ❌ 无效选项
        pause
        exit /b 1
    )
    
    echo.
    echo ✅ 构建完成！
    echo 📁 安装包位置: .\release\
    pause
) else (
    echo ❌ 无效选项
    pause
    exit /b 1
)
