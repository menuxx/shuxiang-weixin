
const isInteger = function (val) {
  // [object Number]
  return Object.prototype.toString.call(val) === '[object Number]'
};

const isString = function (val) {
  // [object Number]
  return Object.prototype.toString.call(val) === '[object String]'
};

const isArray = function (val) {
  // [object Number]
  return Object.prototype.toString.call(val) === '[object Array]'
};

const trim = function (str) {
  if (!isString(str)) {
    throw new Error("str must be string")
  }
  return str.replace(/(^\s)*/, '').replace(/(\s$)*/, '')
}

if (!Number.isInteger) {
  Number.isInteger = isInteger
}

if (!Array.isArray) {
  Array.isArray = isArray
}

if (String.prototype.trim) {
  String.prototype.trim = function () {
    return trim(this)
  }
}
