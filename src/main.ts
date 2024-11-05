import { app, BrowserWindow } from 'electron';
import * as path from 'path';

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    // ... 现有配置 ...
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // 加载 index.html
  mainWindow.loadFile('src/index.html')

  // 打开开发者工具
  mainWindow.webContents.openDevTools()
}

// ... 其余代码 ...

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})