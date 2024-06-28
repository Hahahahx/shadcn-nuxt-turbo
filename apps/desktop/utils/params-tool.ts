function toFormData(params: any) {
  const data = new FormData()
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined) {
      if (Array.isArray(params[key])) {
        params[key].forEach((item: string | Blob, index: any) => {
          data.append(`${key}[]`, item)
        })
      }
      else {
        data.append(key, params[key])
      }
    }
  })

  return data
}

export const paramsTool = {
  toFormData,
}
