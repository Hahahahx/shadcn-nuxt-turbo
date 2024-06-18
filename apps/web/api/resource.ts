import type { FileInfo } from './bucket'

// 资源属性
export interface ResourceInfo {
  BucketName: string
  ClassID: string
  ClassName: string
  Createtime: number
  Description: string
  Document: string
  EffectiveTime: number
  Ico: string
  ID: string
  IsEnable: boolean
  Name: string
  Download: number
  OwnerID: string
  DownloadUrl: string
  ShopID: string
  ShopName?: string
  FileInfo: FileInfo[]
  Tags?: string[]
  Type?: string
}

// 资源创建
export interface ResourceCreate {
  Type: string
  Ico: File
  Background: File
  Name: string
  Path: string
  BucketName: string
  Description: string
  IsEnable: boolean
  ClassID: string
  Tags: string[]
  Document: string
  ShopID: string
}

// 资源修改
export interface ResourceUpdate extends Partial<ResourceCreate> {
  ResourceID: string
}

export interface ResourceRequest {
  /**
   * 分类
   */
  ClassName?: string
  /**
   * 用户
   */
  DepId?: string
  /**
   * 名称过滤
   */
  Name?: string
  /**
   * 当前页
   */
  Page?: number
  /**
   * 页大小
   */
  PageSize?: number
  /**
   * 店铺名称
   */
  ShopName?: string
  /**
   * 名称Name,使用大小TotalSize,对象大小FileNum,配额大小QuotaSize,
   */
  SortName?: string
  /**
   * 升序 asc,降序desc
   */
  SortOrder?: string
  /**
   * 标签
   */
  Tags?: string[]
}

export interface ResourceDashboard {
  ID: string
  Name: string
  ResourceFile: ResourceInfo[]
}

export const resourceApi = {
  dashboard: () => request.get<Page.Response<ResourceDashboard>>('user/data/resource/dashboard'),
  list: (params: ResourceRequest & {
    ShopName?: string
  }) => request.get<Page.Response<ResourceInfo>>('user/data/resource', params),
  detail: (params: {
    ID?: string
    Path?: string
  }) => request.get<ResourceInfo>('user/data/resource/detail', params),
  // 添加资源
  create: (params: ResourceCreate) => {
    const data = paramsTool.toFormData(params)
    return request.post('user/data/resource', data)
  },
  download: (params: {
    DownloadUrl: string
  }) => {
    window.open(`${params.DownloadUrl}`)
  },
  // 删除资源
  delete: (data: ResourceInfo) => request.delete('user/data/resource', {
    ID: data.ID,
  }),
  resolution: (src?: string, style: 'st1' | 'st2' | 'st3' = 'st1', refresh?: boolean) => src ? `${src}&style=${style}${refresh ? `&timestamp=${new Date().getTime()}` : ''}` : '/null.webp',
  // 更新资源
  update: (params: ResourceUpdate) => {
    const data = paramsTool.toFormData(params)
    return request.patch('user/data/resource', data)
  },
  // 标签列表
  tags: () => request.get<string[]>('/resource/tags'),
}
