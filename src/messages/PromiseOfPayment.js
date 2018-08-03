const AbstractMessage = require('./AbstractMessage')

class PromiseOfPayment extends AbstractMessage {
  constructor(type, identityKeys, packet) {
    super(type, identityKeys, packet)

    if (type === 'receive') {
      this._validateMessage(this._message)
    }
  }

  // common methods
  _validateMessage(message) {
    // validation logic goes here. if invalid, throw error
  }

  // send methods

  // receive methods

}

module.exports = PromiseOfPayment