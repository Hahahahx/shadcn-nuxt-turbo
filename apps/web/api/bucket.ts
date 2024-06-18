export interface BucketInfo {
  FileNum: number
  Mtime: number
  Name: string
  Path: string
  QuotaSize: number
  TotalSize: number
}

export interface BucketCreateAndEditParams {

  BucketName: string
  BucketLimitSize: number
}

export interface FileInfo {
  Name: string
  FileSize: number
  Type: string
  Mtime: number
  Path: string
  DownloadUrl: string
}

export interface FileEditParams {
  OldFileName: string
  NewFileName: string
}

export interface CreateDirParams {
  DirName: string
}

/**
 * 返回的数据
 */
export interface FileinfoData {
  ChunkList?: FileinfoDataChunkList
  /**
   * 文件创建时间
   */
  Ctime?: number
  /**
   * 文件最后修改时间
   */
  Mtime?: number
  /**
   * 文件名
   */
  Name?: string
  /**
   * 文件路径
   */
  Path?: string
  /**
   * 文件大小
   */
  Size?: number
  /**
   * 文件类型
   */
  Type?: string
  [property: string]: any
}

/**
* jwanfs-web-server.server.api.v1.ChunkList
*/
export interface FileinfoDataChunkList {
  /**
   * 分块数量
   */
  Chunks?: FileinfoDataChunkInfo[]
  /**
   * 分块数量
   */
  Total?: number
  [property: string]: any
}

/**
* jwanfs-web-server.server.api.v1.ChunkInfo
*/
export interface FileinfoDataChunkInfo {
  /**
   * 分块ID
   */
  ChunkID?: string
  /**
   * 分块大小 单位KB
   */
  ChunkSize?: number
  /**
   * 数据中心标签
   */
  DataCenterTags?: string[]
  /**
   * 内部存储卷地址
   */
  InternalURL?: string[]
  /**
   * 服务器标签
   */
  ServerTags?: string[]
  [property: string]: any
}

export interface RecycledInfo {
  /**
   * 删除时间，时间戳精确到毫秒
   */
  DeleteTime: number
  /**
   * 文件大小
   */
  FileSize: number
  /**
   * 是否是文件夹
   */
  IsDirectory: boolean
  /**
   * 是否来自Grpc
   */
  IsFromGrpc: boolean
  /**
   * 文件最后修改时间，时间戳精确到秒
   */
  Mtime: number
  /**
   * 文件名称
   */
  Name: string
  /**
   * 文件夹路径
   */
  Path: string
  /**
   * Grpc客户端进程号
   */
  PID: string
  /**
   * 回收站有效时间，时间戳精确到秒
   */
  RecycleEffectTime: number
  /**
   * 文件状态
   */
  Status: number
  /**
   * 文件类型
   */
  Type: string
}

export const bucketApi = {
  list: (params: Page.Request) => request.get<Page.Response<BucketInfo>>('file_manage/bucket', params),
  create: (params: BucketCreateAndEditParams) => request.post(`file_manage/bucket/${params.BucketName}`, {
    BucketLimitSize: params.BucketLimitSize,
  }),
  edit: (params: BucketCreateAndEditParams) => request.put(`file_manage/bucket/${params.BucketName}`, {
    BucketLimitSize: params.BucketLimitSize,
  }),
  delete: (BucketName: string) => request.delete(`file_manage/bucket/${BucketName}`),
  detail: {
    list: (params: Page.Request, path: string) => request.get<Page.Response<FileInfo>>(`file_manage/file/${path}`, params),
    delete: (path: string) => request.delete(`file_manage/file/${path}`),
    edit: (params: FileEditParams, path: string) => request.put(`file_manage/file/${path}/${params.OldFileName}`, params),
    createDir: (params: CreateDirParams, path: string) => request.post(`file_manage/folder/${path}/${params.DirName}`),
    upload: (file: File, url: string, token: string) => {
      const formData = new FormData()
      formData.append('File', file)
      formData.append('Size', file.size.toString())
      return request.upload(`${url}?Token=${token}`, formData, token)
    },
    info: (path: string) => request.get<FileinfoData>(`file_manage/fileinfo/${path}`),
    uploadUrl: (params: {
      Path: string
    }) => request.get<{
      token: string
      url: string
      endpoint: string
    }>('file_manage/get/upload/info', params),
    download: (params: FileInfo) => {
      request.get<{
        Url: string
      }>(`file_manage/download/${params.Path}`).then((res) => {
        window.open(res.Url)
      })
      // "/file_manage/download"
      // window.open(`${params.DownloadUrl}`)
    },
    downloadUrl: (params: FileInfo) => {
      return (`${params.DownloadUrl}`)
    },
  },
  recycle: {
    list: (params: Page.Request & { BucketName: string }) => request.get<Page.Response<RecycledInfo>>('recycle_file/list', params),
    delete: (params: RecycledInfo) => request.post<{
      ShareUrl: string
    }>('recycle_file/delete', params),
    restore: (params: RecycledInfo) => request.post<{
      ShareUrl: string
    }>('recycle_file/restore', params),
  },
}
