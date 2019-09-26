'use strict'
var cl     = require('chloride')

exports.hash = function (data, enc) {
  data = (
    'string' === typeof data && enc == null
  ? Buffer.from(data, 'binary')
  : Buffer.from(data, enc)
  )
  return cl.crypto_hash_sha256(data).toString('base64')+'.sha256'
}

exports.hasSigil = function hasSigil (s) {
  return /^(@|%|&)/.test(s)
}

function feedType (key, feedType) {
  if(!feedType) throw new Error('no feed type for:' + key.toString('base64'))
  return key.toString('base64')+'.' + feedType.replace(/^\./, '')
}

exports.keysToJSON = function keysToJSON(keys, curve) {
  curve = (keys.curve || curve)

  var pub = feedType(keys.public, curve)
  return {
    curve: curve,
    public: pub,
    private: keys.private ? feedType(keys.private, curve) : undefined,
    id: '@' + pub
  }
}

exports.getFeedType = function getFeedType (string) {
  var i = string.indexOf('.')
  return string.substring(i+1)
}

exports.toBuffer = function (buf) {
  if(buf == null) return buf
  if(Buffer.isBuffer(buf)) return buf
  var i = buf.indexOf('.')
  var start = (exports.hasSigil(buf)) ? 1 : 0
  return Buffer.from(buf.substring(start, ~i ? i : buf.length), 'base64')
}
