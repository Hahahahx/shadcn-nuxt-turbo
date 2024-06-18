export interface Overview {
  AllocateBucketSize: number
  BuketSurplusSize: number
  FileNum: number
  MonthFileSize: number
  QuotaSize: number
  TotalSize: number
  CurrentBucketNum: number
  BucketSurplusQuotaSize: number
}

export interface Storage {
  Name: string
  FileNum: number
  TotalSize: number
  QuotaSize: number
  UsagePercent: number
  DocumentTypeSize: number
  MusicTypeSize: number
  PictureTypeSize: number
  VedioTypeSize: number
  OtherTypeSize: number
}

export const dashboardApi = {
  overview() {
    return request.get<Overview>('dep_dashboard/topic1')
  },
  storage(params: {
    BucketName?: string
    isAll?: number
  }) {
    return request.get<Storage>('dep_dashboard/topic3', params)
  },
  storageBucket() {
    return request.get<
      {
        Name: string
        TotalSize: number
        QuotaSize: number
      }[]
    >('dep_dashboard/topic2')
  },
}
