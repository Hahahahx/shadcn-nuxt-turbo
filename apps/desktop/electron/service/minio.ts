import * as Fs from 'node:fs'
import * as Minio from 'minio'
import { MinioServiceEvent } from '../events'
import type { BucketCreateParams, BucketRemoveParams, ObjectListParams, ObjectUploadParams } from '../preload'
import { ServiceBase } from './service-base'

export class MinioService extends ServiceBase<MinioServiceEvent> {
  minioClient: Minio.Client = null
  windows: Electron.CrossProcessExports.BrowserWindow[] = []

  constructor() {
    super()
    this.MinioClient()
    this.MinioClientByToken()
    this.BucketRemove()
    this.BucketExists()
    this.BucketCreate()
    this.BucketList()
    this.ObjectList()
  }

  // 添加窗体
  addWindow(window: Electron.CrossProcessExports.BrowserWindow) {
    this.windows.push(window)
  }

  // 创建一个Minio客户端
  MinioClient() {
    this.IPC(MinioServiceEvent.Create, async (_, params: Minio.ClientOptions) => {
      if (this.minioClient)
        this.minioClient = null

      this.minioClient = new Minio.Client(params)
      this.token = (JSON.stringify(params))
      return {
        token: this.token,
      }
    })
  }

  // 用Token创建Minio客户端
  MinioClientByToken() {
    this.IPC(MinioServiceEvent.CreateByToken, async (_, token: string) => {
      this.minioClient = new Minio.Client(JSON.parse((token)))
      this.token = token
    })
  }

  // 退出Minio客户端
  MinioClientExit() {
    this.IPC(MinioServiceEvent.Exit, async (_, params: Minio.ClientOptions) => {
      this.minioClient = null
      this.token = null
    })
  }

  // 删除桶
  BucketRemove() {
    this.IPC(MinioServiceEvent.BucketRemove, async (_, params: BucketRemoveParams) => {
      return this.minioClient.removeBucket(params.bucketName)
    }, {
      auth: true,
    })
  }

  // 检查存储桶是否存在
  BucketExists() {
    this.IPC(MinioServiceEvent.BucketExists, (_, bucketName: string) => {
      return this.minioClient.bucketExists(bucketName)
    }, {
      auth: true,
    })
  }

  // 获取桶列表
  BucketList() {
    this.IPC(MinioServiceEvent.BucketsList, () => {
      return this.minioClient.listBuckets()
    }, {
      auth: true,
    })
  }

  // 创建存储桶
  BucketCreate() {
    this.IPC(MinioServiceEvent.BucketCreate, (_, params: BucketCreateParams) => {
      return this.minioClient.makeBucket(params.bucketName, params.region, params.makeOpts)
    }, {
      auth: true,
    })
  }

  // 获取对象列表
  ObjectList() {
    this.IPC(MinioServiceEvent.ObjectsList, (_, params: ObjectListParams) => {
      const objs = this.minioClient.extensions.listObjectsV2WithMetadata(params.bucketName, params.prefix, params.recursive, params.startAfter)

      const stream = new Promise((resolve, reject) => {
        const data = []
        objs.addListener('data', (obj) => {
          data.push(obj)
        })
        objs.addListener('end', (obj) => {
          resolve(data)
        })
        objs.addListener('error', (err) => {
          reject(err)
        })
      })
      return stream
    }, {
      auth: true,
    })
  }

  // 对象上传
  ObjectUpload() {
    this.IPC(MinioServiceEvent.ObjectsUpload, (_, params: ObjectUploadParams) => {
      const file = params.filePath
      const fileStream = Fs.createReadStream(file)

      return new Promise((resolve, reject) => {
        Fs.stat(file, function (err, stats) {
          if (err) {
            console.log('upload file err:', err)
            reject(err)
            return
          }
          this.minioClient.putObject(params.bucketName, params.objectName, fileStream, stats.size, (err, objInfo) => {
            if (err) {
              console.log('upload file err:', err)
              reject(err)
              return
            }
            resolve(objInfo)
          })
        })
      })
    })
  }
}
