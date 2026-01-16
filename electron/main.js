import { app, BrowserWindow, Menu, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// 开发环境检测
const isDev = process.env.NODE_ENV === 'development';

// 在 ES 模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'DopaList - 极简待办事项',
    // 图标路径：开发环境在项目目录，生产环境在 extraResources
    icon: isDev 
      ? path.join(__dirname, '../public/images/favicon.ico')
      : path.join(process.resourcesPath, 'public/images/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false, // 暂时禁用以允许加载本地资源
      allowRunningInsecureContent: true,
    },
    backgroundColor: '#ffffff',
    show: true, // 立即显示窗口，提升感知性能
    // 预加载优化：在背景准备好之前就显示窗口
  });

  // 优化：立即显示窗口，不需要等待 ready-to-show
  // mainWindow.once('ready-to-show', () => {
  //   mainWindow.show();
  // });

  // 错误处理
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('页面加载失败:', errorCode, errorDescription, validatedURL);
    dialog.showErrorBox('加载错误', `无法加载页面: ${errorDescription}\n错误代码: ${errorCode}`);
  });

  // 加载应用
  if (isDev) {
    // 开发环境：加载Vite开发服务器
    mainWindow.loadURL('http://localhost:5173');
    // 打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    // 生产环境：加载构建后的文件
    // 在打包后，app.getAppPath() 返回 app.asar 的路径，dist 在其中
    const appPath = app.getAppPath();
    const indexPath = path.join(appPath, 'dist/index.html');
    
    console.log('=== 生产环境加载信息 ===');
    console.log('应用路径 (app.getAppPath):', appPath);
    console.log('Index.html 路径:', indexPath);
    console.log('__dirname:', __dirname);
    
    // 直接使用 loadFile，这是 Electron 推荐的方式
    // loadFile 会自动处理 app.asar 中的文件
    mainWindow.loadFile(indexPath).then(() => {
      console.log('页面加载成功');
    }).catch((err) => {
      console.error('loadFile 失败:', err);
      // 尝试使用 loadURL
      const fileUrl = `file://${indexPath.replace(/\\/g, '/')}`;
      console.log('尝试使用 loadURL:', fileUrl);
      mainWindow.loadURL(fileUrl).catch((err2) => {
        console.error('loadURL 也失败:', err2);
        dialog.showErrorBox('加载错误', `无法加载应用:\n${err2.message}\n\n路径: ${indexPath}`);
      });
    });
    
    // 生产环境不自动打开开发者工具
    // 如果需要调试，可以通过菜单栏的"视图" -> "开发者工具"或按 F12 打开
  }

  // 设置应用菜单
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: '重做', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectAll' },
      ],
    },
    {
      label: '视图',
      submenu: [
        { label: '重新加载', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: '强制重新加载', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { type: 'separator' },
        { label: '实际大小', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: '放大', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: '缩小', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: '开发者工具', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: '全屏', accelerator: 'F11', role: 'togglefullscreen' },
      ],
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于 DopaList',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于 DopaList',
              message: 'DopaList',
              detail: '极简待办事项管理应用\n融合多巴胺奖励机制\n版本：1.0.0',
              buttons: ['确定'],
            });
          },
        },
      ],
    },
  ];

  // 在开发环境添加开发者工具菜单
  if (isDev) {
    template.push({
      label: '开发',
      submenu: [
        { label: '开发者工具', accelerator: 'F12', role: 'toggleDevTools' },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // 窗口关闭时的处理
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 当 Electron 完成初始化时创建窗口
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
    // 通常会重新创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 当所有窗口都关闭时退出应用（macOS 除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 禁用硬件加速（可选，某些系统上可能需要）
// app.disableHardwareAcceleration();
