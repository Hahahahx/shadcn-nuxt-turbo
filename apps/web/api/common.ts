export const commonApi = {
  categorys: () => request.get<CategoryInfo>('public/class'),
  resources: (params: ResourceRequest & {
    ShopName?: string
  }) => request.get<Page.Response<ResourceInfo>>('public/resource', params),
  resourceDetail: (params: {
    ID?: string
    Path?: string
    Fgw?: string
  }) => request.get<ResourceInfo>('public/resource/detail', params),
  storeDetail: (params: {
    ShopName: string
  }) => request.get<StoreInfo>('public/shop/detail', params),
}

export interface CategoryInfo {
  /**
   * 分类名称
   */
  Class: ClassInfo[]
  /**
   * 完整分类
   */
  Tags: TagInfo[]
}

export interface ClassInfo {
  /**
   * 分类ID
   */
  ID: string
  /**
   * 分类名称
   */
  Name: string
}

export interface TagInfo {
  /**
   * 标签ID
   */
  ID: string
  /**
   * 标签名称
   */
  Name: string
}
