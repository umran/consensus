const crypto = require('../crypto')
const encoders = require('../utilities/encoders')
const Invoice = require('../messages').Invoice
const PromiseOfPayment = require('../messages').PromiseOfPayment
const EscrowContract = require('../messages').EscrowContract
const ProofOfDelivery = require('../messages').ProofOfDelivery

class TransactionChain {
  constructor(identities) {
    this._identities = identities
    this._metaData = {}
  }

  _checkInvoice() {
    const invoicePacket = {
      header: {
        signature: this._metaData.invoice.messageSignature,
        ephemeralPublicKey: this._metaData.invoice.senderEphemeralPublicKey,
        ephemeralPublicKeyCertificate: this._metaData.invoice.senderEphemeralPublicKeyCertificate,
        identityPublicKey: this._identities.merchant
      },
      body: this._invoiceMessage
    }

    // implicitly verify packet by constructing new received packet
    return new Invoice({type: 'receive', packet: invoicePacket})

  }

  _checkPromiseOfPayment() {
    let invoice = this._checkInvoice()
    const promiseOfPaymentPacket = {
      header: {
        signature: this._metaData.promiseOfPayment.messageSignature,
        ephemeralPublicKey: this._metaData.promiseOfPayment.senderEphemeralPublicKey,
        ephemeralPublicKeyCertificate: this._metaData.promiseOfPayment.senderEphemeralPublicKeyCertificate,
        identityPublicKey: this._identities.customer
      },
      body: {
        invoiceSig: this._metaData.invoice.messageSignature,
        invoice: invoice.readMessage()
      }
    }

    // implicitly verify packet by constructing new received packet
    return new PromiseOfPayment({type: 'receive', packet: promiseOfPaymentPacket})
  }

  _checkEscrowContract() {
    let promiseOfPayment = this._checkPromiseOfPayment()
    const escrowContractPacket = {
      header: {
        signature: this._metaData.escrowContract.messageSignature,
        ephemeralPublicKey: this._metaData.escrowContract.senderEphemeralPublicKey,
        ephemeralPublicKeyCertificate: this._metaData.escrowContract.senderEphemeralPublicKeyCertificate,
        identityPublicKey: this._identities.server
      },
      body: {
        promiseOfPaymentSig: this._metaData.promiseOfPayment.messageSignature,
        promiseOfPayment: promiseOfPayment.readMessage()
      }
    }

    // implicitly verify packet by constructing new received packet
    return new EscrowContract({type: 'receive', packet: escrowContractPacket})
  }

  _checkProofOfDelivery() {
    let escrowContract = this._checkEscrowContract()
    const proofOfDeliveryPacket = {
      header: {
        signature: this._metaData.proofOfDelivery.messageSignature,
        ephemeralPublicKey: this._metaData.proofOfDelivery.senderEphemeralPublicKey,
        ephemeralPublicKeyCertificate: this._metaData.proofOfDelivery.senderEphemeralPublicKeyCertificate,
        identityPublicKey: this._identities.customer
      },
      body: {
        escrowContractSig: this._metaData.escrowContract.messageSignature,
        escrowContract: escrowContract.readMessage()
      }
    }

    // implicitly verify packet by constructing new received packet
    return new ProofOfDelivery({type: 'receive', packet: proofOfDeliveryPacket})
  }

  setInvoice(invoiceMeta, invoiceMessage) {
    this._metaData.invoice = invoiceMeta
    this._invoiceMessage = invoiceMessage
  }

  setPromiseOfPayment(promiseOfPaymentMeta) {
    this._metaData.promiseOfPayment = promiseOfPaymentMeta
  }

  setEscrowContract(escrowContractMeta) {
    this._metaData.escrowContract = escrowContractMeta
  }

  setProofOfDelivery(proofOfDeliveryMeta) {
    this._metaData.proofOfDelivery = proofOfDeliveryMeta
  }
}

module.exports = TransactionChain
