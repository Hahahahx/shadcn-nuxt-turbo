/* eslint-disable max-statements-per-line */
/* eslint-disable turbo/no-undeclared-env-vars */
import path from 'node:path'
import type { BrowserWindow } from 'electron'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { MinioService, WindowService } from './service'

process.env.APP_ROOT = path.join(__dirname, '..')

const isProd = process.env.VITE_DEV_SERVER_URL === undefined

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, '.output/public')

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

if (isProd)
  serve({ directory: 'app' })
else
  app.setPath('userData', `${app.getPath('userData')} (development)`)

let windowIsReady = false
let mainWindow: BrowserWindow

async function getMainWindowWhenReady() {
  if (!windowIsReady)
    await new Promise(resolve => ipcMain.once('window-is-ready', resolve))

  return mainWindow
} (async () => {
  const shouldContinue = checkLauncherUrl(getMainWindowWhenReady)
  if (!shouldContinue)
    return

  await app.whenReady()

  ipcMain.once('window-is-ready', () => {
    windowIsReady = true
  })

  console.log(path.join(__dirname, 'preload.js'))

  mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // 初始化Minio
  new MinioService().addWindow(mainWindow)
  new WindowService().addWindow(mainWindow)

  // // 1. 窗口 最小化
  // ipcMain.on('window-min', () => { // 收到渲染进程的窗口最小化操作的通知，并调用窗口最小化函数，执行该操作
  //   mainWindow.minimize()
  // })
  // // 2. 窗口 最大化、恢复
  // ipcMain.on('window-max', () => {
  //   if (mainWindow.isMaximized()) { // 为true表示窗口已最大化
  //     mainWindow.restore()// 将窗口恢复为之前的状态.
  //   }
  //   else {
  //     mainWindow.maximize()
  //   }
  // })

  // // 3. 关闭窗口
  // ipcMain.on('window-close', () => {
  //   mainWindow.close()
  // })

  if (isProd) {
    await mainWindow.loadURL('app://./server')
  }
  else {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
    // const port = process.argv[2]
    // await mainWindow.loadURL(`http://localhost:${port}/`)
    // mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

function checkLauncherUrl(getMainWindow) {
  if (process.platform === 'darwin') {
    app.on('open-url', async (_event, url) => {
      const mainWindow = await getMainWindow()
      mainWindow.webContents.send('launcher-url', url)
      mainWindow.isMinimized() && mainWindow.restore()
    })
  }

  if (process.platform === 'win32') {
    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
      app.quit()
      return false
    }

    app.setAsDefaultProtocolClient('your-custom-protocol-scheme')

    app.on('second-instance', async (_event, args) => {
      const mainWindow = await getMainWindow()

      const url = args.find(arg =>
        arg.startsWith(`${'your-custom-protocol-scheme'}://`),
      )
      url && mainWindow.webContents.send('launcher-url', url)

      mainWindow.isMinimized() && mainWindow.restore()
      mainWindow.focus()
    })

    const url = process.argv.find(arg =>
      arg.startsWith(`${'your-custom-protocol-scheme'}://`),
    )
    url
      && getMainWindow().then(mainWindow =>
        mainWindow.webContents.send('launcher-url', url),
      )
  }

  return true
}
