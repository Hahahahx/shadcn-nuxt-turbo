export interface ShareInfo {
  Id: any
  Name: string
  ShareUrl: string
  Status: number
  ExploreTime: number
}

export interface ShareCreate {
  Path: string
  Expire: number
  ShareFilePassword?: string
  IsEncrypt: boolean
}

export const shareApi = {
  list: (params: Page.Request) => request.get<Page.Response<ShareInfo>>('file_share/list', params),
  create: (params: ShareCreate) => request.post<{ ShareUrl: string }>('file_share/save', params),
  delete: (params: ShareInfo) => request.post<{ ShareUrl: string }>('file_share/delete', params),
  shareUrl: (params: ShareInfo) => `${window.location.origin}${baseURL.v1}file_manage/proxyfgw/${params.ShareUrl}`,
}
