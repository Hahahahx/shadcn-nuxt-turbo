export const authApi = {
  captcha: () => request.get<{
    imgByte: string
    uuid: string
  }>('captcha'),
  auditors: () => request.get<{
    Id: string
    UserName: string
  }[]>('sys_user_audit_list'),
  sendCode(params: { Phone?: string; Email?: string }) {
    return request.post('dep_send_login_code', params)
  },
  sendSafeCode(params: { Type?: 'phone' | 'totp' | 'email' }) {
    return request.post('dep_person/send/check/code', params)
  },
  loginSafeCheck(params: {
    Code: string
    UserName?: string
    Phone?: string
    Email?: string
  }) {
    return request.post<{
      Token: string
    }>('dep_login_code', params)
  },
  loginByDevice(params: {
    Email?: string
    Phone?: string
    UserName?: string
    Code: string
  }) {
    return request.post<{
      Token: string
      Email?: string
      Phone?: string
    }>('dep_login_code', params)
  },
  callbackSSO: (sso: string, params: { Code: string }) => {
    return request.post<{ Token: string }>(`dep_login/ssocallback/${sso}`, params)
  },
  loginByOauth: async (sso: 'ihep' | 'carsipre', state: string) => {
    const res = await request.get<{
      RedirectURL: string
    }>(`dep_login/sso/${sso}`, {
      state,
    })
    window.open(res.RedirectURL)
  },
  login(params: {
    UserName: string
    Password: string
    Code: string
    UUID: string
  }) {
    return request.post<{
      Token: string
      Email?: string
      Phone?: string
      UserName?: string
    }>('dep_login', params)
  },
  register: (params: Partial<ReigsterParams>) => request.post('dep_register', params),
  postSafeCheck(params: { Code: string; CodeType: string }) {
    return request.post('dep_person/safe/check', params)
  },
  postIsSafe() {
    return request.post<boolean>('dep_person/is/safe')
  },
}

export interface ReigsterParams {
  /**
   * 验证码
   */
  Code: string
  /**
   * Email
   */
  Email: string
  /**
   * 密码
   */
  Password: string
  /**
   * 管理用户ID
   */
  SysUserId?: string
  /**
   * 用户名称
   */
  UserName: string
  /**
   * Uuid
   */
  Uuid: string

  RandomPass?: boolean
}
