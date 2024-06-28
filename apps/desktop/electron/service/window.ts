import { WindowServiceEvent } from '../events'
import { ServiceBase } from './service-base'

export class WindowService extends ServiceBase<WindowServiceEvent> {
  windows: Electron.CrossProcessExports.BrowserWindow[] = []

  constructor() {
    super()
    this.Min()
    this.Max()
    this.Close()
  }

  Min() {
    this.IPC(WindowServiceEvent.Min, async (event) => {
      this.windows.forEach((window) => {
        window.id === event.sender.id && window.minimize()
      })
    })
  }

  Max() {
    this.IPC(WindowServiceEvent.Max, async (event) => {
      this.windows.forEach((window) => {
        if (window.id === event.sender.id) {
          if (window.isMaximized()) { // 为true表示窗口已最大化
            window.restore()// 将窗口恢复为之前的状态.
          }
          else {
            window.maximize()
          }
        }
      })
    })
  }

  Close() {
    this.IPC(WindowServiceEvent.Close, async (event) => {
      this.windows.forEach((window) => {
        window.id === event.sender.id && window.close()
      })
    })
  }
}
