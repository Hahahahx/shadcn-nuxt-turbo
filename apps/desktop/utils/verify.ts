function test(regexp: RegExp) {
  return (v: any) => regexp.test(v)
}

const ip = test(
  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
)

const cidr = test(
  /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([1-9]|[1-2]\d|3[0-2])$/,
)
const cidrZero = test(
  /^(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/([0-9]|[1-2]\d|3[0-2])$/,
)

const MAC = test(
  /[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/,
)

const email = test(
  /^([a-zA-Z]|[0-9])(\w|\\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
)
const id = test(
  /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
)

const phone = test(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)

function compareMinAndMax(value: number, min: number, max: number) {
  value = Number(value)
  return value >= min && value <= max
}

export const verify = {
  test,
  ip,
  cidr,
  cidrZero,
  MAC,
  email,
  id,
  phone,
  compareMinAndMax,
}
