// 店铺属性
export interface StoreInfo {
  Background: string
  ClassID: string
  ClassName: string
  Createtime: number
  Ico: string
  Mark: string
  Name: string
  OwnerID: string
  ShopID: string
  Tags: string[]
}

// 店铺创建属性
export interface StoreCreate {
  Ico: File
  ShopName: string
  Background: File
  ClassID: string
  Tags: string[]
  Mark: string
}

export interface StoreListQuery {
  /**
     * 分类
     */
  ClassName?: string
  /**
    * 用户
    */
  DepId?: string | number
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

  ShopName?: string
}

export const storeApi = {
  // 店铺列表
  list: (params: StoreListQuery) => request.get<Page.Response<StoreInfo>>('user/manage/shop', params),
  detail: (params: {
    ShopName: string
  }) => request.get<StoreInfo>('user/manage/shop/detail', params),
  // 添加店铺
  create: (params: StoreCreate) => {
    const data = paramsTool.toFormData(params)
    return request.post('user/manage/shop', data)
  },
  // 删除店铺
  delete: (params: StoreInfo) => request.delete<StoreInfo>('user/manage/shop', params),
  // 修改店铺
  update: (params: StoreCreate & { ShopID: string }) => {
    const data = paramsTool.toFormData(params)
    return request.patch('user/manage/shop', data)
  },
  official: () => request.get<Page.Response<StoreInfo>>('user/manage/sysshop'),
}
