const encoders = require('../encoders')
const crypto = require('../crypto')

class AbstractMessage {
  constructor(type, identityKeys, packet) {
    if(type === 'send') {
      this._identityPublicKey = identityKeys.publicKey
      this._ephemeralKeys = crypto.generateEphemeralKeys(identityKeys.secretKey)
    }
    else if (type === 'receive') {
      packet = identityKeys
      this._packet = JSON.parse(packet)
      this._validatePacket()
      this._verifyPacket()
      this._setMeta(this._packet.header)
      this._setMessage(this._packet.body)
    }
    else {
      throw new Error('Unrecognized message type')
    }
  }

  // common methods
  _setMessage(message) {
    this._message = message
  }

  _getMessage() {
    return this._message
  }

  _setMeta(header) {
    this._meta = {
      senderId: header.identityPublicKey,
      messageSignature: header.signature,
      senderEphemeralPublicKey: header.ephemeralPublicKey,
      senderEphemeralPublicKeyCertificate: header.ephemeralPublicKeyCertificate
    }
  }

  _getMeta() {
    return this._meta
  }

  _validatePacket() {
    // validation rules go here. throw error if invalid
    this._validateHeader()
    this._validateBody()
  }

  _validateHeader() {
    // more comprehensive validation rules will be added later

  }

  _validateBody() {
    // more comprehensive validation rules will be added later
  }

  _validateMessage(message) {
    throw new Error('Child class must implement method')
  }

  readMeta() {
    return this._getMeta()
  }

  // send methods

  _signMessage() {
    var message = JSON.stringify(this._message)
    message = encoders.stringToByteArray(message)

    return crypto.primitives.sign(message, this._ephemeralKeys.secretKey)
  }

  _generateHeader() {
    const headers = {
      signature: this._signMessage(),
      ephemeralPublicKey: this._ephemeralKeys.publicKey,
      ephemeralPublicKeyCertificate: this._ephemeralKeys.certificate,
      identityPublicKey: this._identityPublicKey
    }

    return Object.keys(headers).reduce((result, key) => {
      result[key] = encoders.byteArrayToHex(headers[key])
      return result
    }, {})
  }

  _generateBody() {
    return this._message
  }

  _packetize() {
    const header = this._generateHeader()
    const body = this._generateBody()

    this._packet = {
      header: header,
      body: body
    }
  }

  write(message) {
    this._validateMessage(message)
    this._setMessage(message)
  }

  generate() {
    this._packetize()
    this._validatePacket()
    this._setMeta(this._packet.header)
    return JSON.stringify(this._packet)
  }

  // receive methods

  _verifyPacket() {
    // verify ephemeral public key
    const ephemeralPublicKey = encoders.hexToByteArray(this._packet.header.ephemeralPublicKey)
    const ephemeralPublicKeyCertificate = encoders.hexToByteArray(this._packet.header.ephemeralPublicKeyCertificate)
    const identityPublicKey = encoders.hexToByteArray(this._packet.header.identityPublicKey)

    const ephemeralPublicKeyVerification = crypto.primitives.verifySignature(ephemeralPublicKey, ephemeralPublicKeyCertificate, identityPublicKey)

    if(!ephemeralPublicKeyVerification) {
      throw new Error('Ephemeral public key verification failed')
    }

    // verify message
    var message = JSON.stringify(this._packet.body)
    message = encoders.stringToByteArray(message)
    const signature = encoders.hexToByteArray(this._packet.header.signature)

    const messageVerification = crypto.primitives.verifySignature(message, signature, ephemeralPublicKey)

    if(!messageVerification) {
      throw new Error('Message verification failed')
    }
  }

  readMessage() {
    return this._getMessage()
  }

}

module.exports = AbstractMessage
