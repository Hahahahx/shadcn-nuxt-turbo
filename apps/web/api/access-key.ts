export interface AccessKeyInfo {
  AccessKey: string
  SecretKey: string
  Expiration: number
}

export interface AccessKeyCreate {
  // 过期时间
  Expiration: number
}

export const accessKeyApi = {
  list: (params: Page.Request) => request.get<Page.Response<AccessKeyInfo>>('access_key/list', params),
  show: (params: AccessKeyInfo) => request.get<{
    SecretKey: string
  }>('access_key/show', params),
  create: (params: AccessKeyCreate) => request.post('access_key/save', params),
  delete: (params: AccessKeyInfo) => {
    return request.post('access_key/change/status', {
      AccessKey: params.AccessKey,
      Status: 3,
    })
  },
}
