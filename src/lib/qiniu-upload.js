
import http from '../http'

function getError(action, option, xhr) {
  let msg;
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`;
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`;
  } else {
    msg = `fail to post ${action} ${xhr.status}`;
  }

  const err = new Error(msg);
  err.status = xhr.status;
  err.method = 'post';
  err.url = action;
  return err;
}

function getSuffix(filename) {
  let pos = filename.lastIndexOf('.');
  return pos !== -1 ? filename.substring(pos) : ''
}

function randomString (len = 32) {
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let maxPos = chars.length;
  let pwd = '';

  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

function getBody(xhr) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

function post (url, data, onProgress) {
  var xhr = new XMLHttpRequest()
  xhr.open("POST", url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  if (xhr.upload) {
    xhr.upload.onprogress = onProgress
  }
  xhr.send(data)
  return new Promise(function (resolve, reject) {
    xhr.onload = function () {
      if (xhr.status < 200 || xhr.status >= 300) {
        return reject({ action: 'post', xhr });
      }
      resolve(getBody(xhr))
    };
    xhr.onerror = reject
  })
}

/**
 * <form method="post" action="http://upload.qiniu.com/"
 *  enctype="multipart/form-data">
 * <input name="key" type="hidden" value="<resource_key>">
 * <input name="x:<custom_name>" type="hidden" value="<custom_value>">
 * <input name="token" type="hidden" value="<upload_token>">
 * <input name="file" type="file" />
 * <input name="crc32" type="hidden" />
 * <input name="accept" type="hidden" />
 * </form>
 * @param request
 *
 */
function getUpToken () {
  return http.get('/upload/qn_uptoken').then( res => res.data )
}

/**
 * https://developer.qiniu.com/kodo/api/1312/upload
 * @param request
 */

 function getEnvHttpOrHttps() {
   if( /https:/.test(location.protocol) ) {
     return 'https'
   } else {
     return 'http'
   }
 }

export default function (option) {
  var form = new FormData()
  return getUpToken().then(function (token) {
    var suffix = '.png'
    if (option.file.name) {
      suffix = getSuffix(option.file.name)
    }
    form.append("key", option.data.keyPrefix + randomString(10) + suffix)
    form.append("token", token.uptoken)
    form.append("file", option.file)
    form.append("accept", "application/json")
    return post(getEnvHttpOrHttps() + '://upload.qiniup.com', form, function onProgress(e) {
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100;
      }
      option.onProgress(e)
    })
  }).then(function (res) {
    option.onSuccess(res)
  }, function (err) {
    option.onError(getError(err.action, option, err.xhr))
  })
}
