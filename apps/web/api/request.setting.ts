export const baseURL = {
  v1: '/api/v1/',
}

async function post<T>(method: 'POST' | 'PATCH' | 'PUT', url: string, data?: any, opts: { [k: string]: any } = { headers: {} }) {
  const headers = opts.headers ?? {}
  const res = await $fetch<HTTP.Response<T>>(baseURL.v1 + url, {
    method,
    body: data,
    ...opts,
    headers: {
      UToken: storage.GetItem('UToken'),
      ...headers,
    },
  })
  // 第三方登录跳转至需要注册（信息补充）
  if (res.Code === 401) {
    navigateTo(`/login/complete?CarsiCode=${(res as HTTP.Response<T, 401>).Data.Token}`, {
      replace: true,
    })
  }

  if (res.Code === 13) {
    storage.RemoveItem('UToken')
    navigateTo('/login')
  }

  // 安全验证
  if (res.Code === 60)
    throw res.Code

  if (res.Code !== 0)
    throw new Error(res.Msg)

  return res.Data
}

async function get<T>(method: 'DELETE' | 'GET', url: string, data?: any) {
  const res = await $fetch<HTTP.Response<T>>(baseURL.v1 + url, {
    method,
    query: data,
    // @ts-expect-error
    headers: {
      UToken: storage.GetItem('UToken'),
    },
  })

  // 第三方登录跳转至需要注册（信息补充）
  if (res.Code === 401) {
    navigateTo(`/register?CarsiCode=${(res as HTTP.Response<T, 401>).Data.Token}`, {
      replace: true,
    })
  }

  if (res.Code === 13) {
    storage.RemoveItem('UToken')
    navigateTo('/login')
  }

  // 安全验证
  if (res.Code === 60)
    throw res.Code

  if (res.Code !== 0)
    throw new Error(res.Msg)

  return res.Data
}

export const request = {
  post: <T>(url: string, data?: any) => post<T>('POST', url, data),
  patch: <T>(url: string, data?: any) => post<T>('PATCH', url, data),
  put: <T>(url: string, data?: any) => post<T>('PUT', url, data),
  get: <T>(url: string, data?: any) => get<T>('GET', url, data),
  delete: <T>(url: string, data?: any) => get<T>('DELETE', url, data),
  upload: <T>(url: string, data?: any, token = '') => {
    // $fetch 上传会报错
    return fetch(url, {
      method: 'post',
      body: data,
      headers: {
        token,
      },
    })
      .then((response) => {
        if (response.ok)
          return response.json() as T

        else
          throw new Error(`${response.status} : ${response.statusText}`)
      })
  },
}
