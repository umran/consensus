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

  // this method checks that who we assume to be the merchant actually did sign the invoice
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

  // this method checks that who we assume to be the customer actually did sign the promise of payment referencing what we have verified to be a valid invoice signed by who we assume to be the merchant
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

  // this method checks that who we assume to be the server actually did sign the escrow contract referencing what we have verified to be a valid promise of payment signed by who we assume to be the customer
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

  // this method checks that who we assume to be the client actually did sign the proof of delivery referencing what we have verified to be a valid escrow contract signed by who we assume to be the server
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

  checkPromiseOfPayment() {
    return this._checkPromiseOfPayment()
  }

  checkEscrowContract() {
    return this._checkEscrowContract()
  }

  checkProofOfDelivery() {
    return this._checkProofOfDelivery()
  }
}

module.exports = TransactionChain
