
export interface UserSendCode {
  Phone?: string
  Email?: string
  Type: 'phone' | 'email'
}

export const userApi = {
  info: () => request.get<UserInfo>('dep_person/info'),
  edit: (params: UserEdit) => request.post('dep_person/update', params),
  sendCode: (params: UserSendCode) => request.post('dep_person/send/new/info/code', params),
  qrTotpCode: () => request.get<{
    Qr: string,
    TotpSecret: string
  }>('dep_person/reload/totp'),
  bindSSO:(sso:string,isBind?:boolean)=>{
    if(!isBind){
      return request.post<{ Token: string }>(`dep_login/bindcallback/${sso}`)
    }else{
      return request.post<{ Token: string }>(`dep_login/unbindcallback/${sso}`)
    }
  },
}


export interface UserEdit {
  NickName?: string
  /**
    * 是否清除双因素认证,1清除
    */
  ClearTotp?: number;
  /**
   * 验证码
   */
  Code?: string;
  /**
   * 邮箱
   */
  Email?: string;
  /**
   * 部门账号Id
   */
  Id?: string;
  /**
   * 是否安全认证:1-是,2-不是
   */
  IsSafeCheck?: number;
  /**
   * 旧密码
   */
  OldPassword?: string;
  /**
   * 密码
   */
  Password?: string;
  /**
   * 手机号
   */
  Phone?: string;
  /**
   * 协议密码
   */
  ProtocolPassword?: string;
  /**
   * 双因素认证验证码
   */
  TotpCode?: string;
  /**
   * 双因素认证密钥
   */
  TotpSecret?: string;
}




export interface UserInfo {
  CreateTime: number;
  Email: string;
  Id: number;
  IsAdmin: number;
  NickName: string;
  Status: number;
  UpdateTime: number;
  DepId: number;
  IsSafeCheck: number;
  IsTotp: number;
  Phone: string;
  status: number;
  IsBindIHEPEmail: number;
  IsBindBeiHang: number
  IsBindCarsiUID:number;
}
