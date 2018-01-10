
export const isProd = function () {
  return process.env.NODE_ENV === 'production' && /^wx\./.test(location.host)
}

export const isTest = function () {
  return process.env.NODE_ENV === 'production' && /^wxtest\./.test(location.host)
}

export const isDev = function () {
  return process.env.NODE_ENV === 'development' && /^wxdev\./.test(location.host)
}