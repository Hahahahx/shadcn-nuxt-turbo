export interface LogInfo {
  /**
   * 日志类型编号
  1-上传文件成功
2-上传文件失败
3-删除文件
4-删除桶
   */
  LogType: string
  /**
   * 日志类型名称
   */
  LogTypeContent: string
  /**
   * 时间戳
   */
  Mtime: string
  /**
   * 文件名
   */
  ObjectName: string
  /**
   * 文件类型
   */
  ObjectType: string

  ObjectSize: number
  /**
   * 所属用户
   */
  OwnerID: string
}

export const logApi = {
  list: (params: Page.Request) => request.get<Page.Response<LogInfo>>('filer_log/list', params),
}
