import crypto from "crypto";
import { ipcMain } from "electron";


export class ServiceBase<Enum extends string> {

  windows: Electron.CrossProcessExports.BrowserWindow[] = []
  token: string
  algorithm = "aes-256-cbc";
  initVector = crypto.randomBytes(16);
  securityKey = crypto.randomBytes(32);



  // 添加窗体
  addWindow(window: Electron.CrossProcessExports.BrowserWindow) {
    this.windows.push(window)
  }


  // 加密Token
  encryptToken(token: string) {
    const cipher = crypto.createCipheriv(this.algorithm, this.securityKey, this.initVector);
    let encryptedData = cipher.update(token, "utf-8", "hex");
    encryptedData += cipher.final("hex");

    console.log('encryptedData:', encryptedData)
    return encryptedData
  }

  // 解密Token
  decryptToken(token: string) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.securityKey, this.initVector);
    let decryptedData = decipher.update(token, "hex", "utf-8");
    decryptedData += decipher.final("utf8");

    console.log('decryptedData:', decryptedData)
    return decryptedData
  }

  // IPC处理
  IPC<T>(eventType: Enum, callback: (event: Electron.IpcMainEvent, ...res: any) => Promise<T>, config?: {
    auth?: boolean
  }) {
    console.log('register event:', eventType)
    ipcMain.on(eventType, async (event, ...args) => {

      console.log('--------------------------------------------------')
      console.log('event:', eventType)
      console.log('args:', args)
      try {
        if (config?.auth && !this.token) {
          event.reply(eventType, Result.Error('未登录'))
          return
        }
        const res = await callback(event, ...args)
        event.reply(eventType, Result.Success(res))
      } catch (err) {
        console.error(err)
        event.reply(eventType, Result.Error(err))
      }
    })
  }
}



export class ServiceResult<T> {
  result: boolean
  msg?: string
  data?: T

  constructor(result: boolean, msg?: string, data?: T) {
    this.result = result
    this.msg = msg
    this.data = data
  }
}

export const Result = {
  Success<T>(data?: T) {
    return new ServiceResult<T>(true, undefined, data)
  },
  Error<T>(msg?: string, data?: T) {
    return new ServiceResult<T>(false, msg, data)
  }
}
