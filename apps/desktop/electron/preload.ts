import type { IpcRendererEvent } from 'electron'
import { contextBridge, ipcRenderer } from 'electron'
import type { BucketItem, BucketItemFromList, ClientOptions, MakeBucketOpt, Region } from 'minio'
import { MinioServiceEvent } from './events'
import type { ServiceResult } from './service'

const handler = {
  send(channel: string, value?: unknown) {
    ipcRenderer.send(channel, value)
  },
  on<T>(channel: string, callback: (args: T) => void) {
    const subscription = (_event: IpcRendererEvent, args: T) =>
      callback(args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
  once<T>(channel: string, callback: (args: T) => void) {
    const subscription = (_event: IpcRendererEvent, args: T) =>
      callback(args)
    ipcRenderer.once(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
}

contextBridge.exposeInMainWorld('ipc', handler)

function MinioPromise<T>(type: MinioServiceEvent, params?: any) {
  return new Promise<T | undefined>((resolve, reject) => {
    console.log('send------', type, params)
    handler.send(type, params)
    handler.once(type, (event: ServiceResult<T>) => {
      console.log(type, event)
      if (event.result)
        resolve(event.data)
      else
        reject(event.msg)
    })
  })
}

export interface BucketCreateParams {
  bucketName: string
  region?: Region
  makeOpts?: MakeBucketOpt
}

export interface BucketRemoveParams {
  bucketName: string
}

export interface ObjectListParams {
  bucketName: string
  prefix?: string
  recursive?: boolean
  startAfter?: string
}

export interface ObjectUploadParams {
  bucketName: string
  objectName: string
  filePath: string
}

const minio = {
  create: (params: ClientOptions) => MinioPromise<{
    token: string
  }>(MinioServiceEvent.Create, params),
  createByToken: (token: string) => MinioPromise(MinioServiceEvent.CreateByToken, token),
  // bucket: {
  //   list: () => MinioPromise<BucketItemFromList[]>(MinioServiceEvent.BucketsList),
  //   create: (params: BucketCreateParams) => MinioPromise(MinioServiceEvent.BucketCreate, params),
  //   remove: (params: BucketRemoveParams) => MinioPromise(MinioServiceEvent.BucketRemove, params),
  // }
}

contextBridge.exposeInMainWorld('minio', minio)

const bucket = {
  list: () => MinioPromise<BucketItemFromList[]>(MinioServiceEvent.BucketsList),
  create: (params: BucketCreateParams) => MinioPromise(MinioServiceEvent.BucketCreate, params),
  remove: (params: BucketRemoveParams) => MinioPromise(MinioServiceEvent.BucketRemove, params),
}

contextBridge.exposeInMainWorld('bucket', bucket)

const object = {
  list: (params: ObjectListParams) => MinioPromise<BucketItem[]>(MinioServiceEvent.ObjectsList, params),
  upload: (params: ObjectUploadParams) => MinioPromise(MinioServiceEvent.ObjectsUpload, params),
}

contextBridge.exposeInMainWorld('object', object)

export type IpcHandler = typeof handler
export type MinioClient = typeof minio
export type BucketHandle = typeof bucket
export type ObjectHandle = typeof object
