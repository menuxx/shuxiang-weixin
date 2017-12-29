import QRious from 'qrious'

export const makeQrcodeDataUrl = (url) => {
  var qr = new QRious({
    value: url
  });
  return qr.toDataURL()
}
