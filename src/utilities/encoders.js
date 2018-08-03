require("google-closure-library")
goog.require("goog.crypt.base64")

exports.byteArrayToB64 = function(bytes) {
	return goog.crypt.base64.encodeByteArray(bytes)
}

exports.b64ToByteArray = function(b64) {
	return goog.crypt.base64.decodeStringToUint8Array(b64)
}

exports.stringToB64 = function(string) {
	var b = new Buffer(string)
	return b.toString('base64')
}

exports.b64ToString = function(b64) {
	var b = new Buffer(b64, 'base64')
	return b.toString()
}

exports.stringToByteArray = function(string) {
	string = this.stringToB64(string)
	return this.b64ToByteArray(string)
}

exports.byteArrayToString = function(bytes) {
	bytes = this.byteArrayToB64(bytes)
	return this.b64ToString(bytes)
}
