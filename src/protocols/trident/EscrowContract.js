const AbstractMessage = require('../AbstractMessage')
const validate = require('../../validators').escrowContract

class EscrowContract extends AbstractMessage {
  constructor(options) {
    super(options)

    if (options.type === 'receive') {
      this._validateMessage(this._message)
    }
  }

  // common methods
  _validateMessage(message) {
    validate(message)
  }

  // send methods

  // receive methods

}

module.exports = EscrowContract
