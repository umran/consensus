var nacl = require('tweetnacl')

exports.generateSigningKeys = function() {
  var keyPair = nacl.sign.keyPair()
  return keyPair
}

exports.sign = function(data, secretKey) {
  var signature = nacl.sign.detached(data, secretKey)
  return signature
}

exports.verifySignature = function(payload, signature, publicKey) {
  return nacl.sign.detached.verify(payload, signature, publicKey)
}

exports.hash = function(message) {
  return nacl.hash(message)
}

exports.compare = function(x, y) {
  return nacl.verify(x, y)
}
