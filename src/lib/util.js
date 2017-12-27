

export const makeSameOriginUrl = function (url) {
  if ( url.startsWith('http://') ) {
    url = url.replace('http://', '')
  } else if ( url.startsWith('https://') )  {
    url = url.replace('https://', '')
  }
  return `http://wxtest.qurenjia.com/proxy/${url}`
}
