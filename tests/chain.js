const crypto = require('../src/crypto')
const Chain = require('../src/transactions/TransactionChain')
const Invoice = require('../src/protocols').trident.Invoice
const PromiseOfPayment = require('../src/protocols').trident.PromiseOfPayment
const EscrowContract = require('../src/protocols').trident.EscrowContract
const ProofOfDelivery = require('../src/protocols').trident.ProofOfDelivery

const encoders = require('../src/utilities/encoders')

// create identities
const Merchant = crypto.generateIdKeys()
const Customer = crypto.generateIdKeys()
const Server = crypto.generateIdKeys()

// Merchant creates the invoice
const invoiceMessage = {
  orderId: "1234983940982098123498394098209812349883940982098123498394098209",
  manifest:[
    { item: "chicken korma", quantity: 2, price: 20, tax: 0.1 },
    { item: "garlic naan", quantity: 6, price: 4, tax: 0.1 }
  ],
  totalPreTax: 64,
  totalPostTax: 67.2
}

let invoice = new Invoice({type: 'send', identityKeys: Merchant})
invoice.write(invoiceMessage)
const invoicePacket = invoice.generate()
console.log(JSON.stringify(invoicePacket))

// Customer verifies and validates the invoice, then creates a PromiseOfPayment using the invoice signature and invoice body
let receivedInvoice = new Invoice({type: 'receive', packet: invoicePacket})
const receivedInvoiceMessage = receivedInvoice.readMessage()
const receivedInvoiceMeta = receivedInvoice.readMeta()

const promiseOfPaymentMessage = {
  invoiceSig: receivedInvoiceMeta.messageSignature,
  invoice: receivedInvoiceMessage
}

let promiseOfPayment = new PromiseOfPayment({type: 'send', identityKeys: Customer})
promiseOfPayment.write(promiseOfPaymentMessage)
const promiseOfPaymentPacket = promiseOfPayment.generate()
console.log(JSON.stringify(promiseOfPaymentPacket))

// Server verifies and validates the promiseOfPayment, then creates an EscrowContract using the promiseOfPayment signature and promiseOfPayment body
let receivedPromiseOfPayment = new PromiseOfPayment({type: 'receive', packet: promiseOfPaymentPacket})
const receivedPromiseOfPaymentMessage = receivedPromiseOfPayment.readMessage()
const receivedPromiseOfPaymentMeta = receivedPromiseOfPayment.readMeta()

const escrowContractMessage = {
  promiseOfPaymentSig: receivedPromiseOfPaymentMeta.messageSignature,
  promiseOfPayment: receivedPromiseOfPaymentMessage
}

let escrowContract = new EscrowContract({type: 'send', identityKeys: Server})
escrowContract.write(escrowContractMessage)
const escrowContractPacket = escrowContract.generate()
console.log(JSON.stringify(escrowContractPacket))

// Customer verifies and validates the escrowContract, then creates a ProofOfDelivery using the escrowContract signature and escrowContract body
let receivedEscrowContract = new EscrowContract({type: 'receive', packet: escrowContractPacket})
const receivedEscrowContractMessage = receivedEscrowContract.readMessage()
const receivedEscrowContractMeta = receivedEscrowContract.readMeta()

const proofOfDeliveryMessage = {
  escrowContractSig: receivedEscrowContractMeta.messageSignature,
  escrowContract: receivedEscrowContractMessage
}

let proofOfDelivery = new ProofOfDelivery({type: 'send', identityKeys: Customer})
proofOfDelivery.write(proofOfDeliveryMessage)
const proofOfDeliveryPacket = proofOfDelivery.generate()
console.log(JSON.stringify(proofOfDeliveryPacket))

// Server verifies and validates the proofOfDelivery, then sends the money to merchant
let receivedProofOfDelivery = new ProofOfDelivery({type: 'receive', packet: proofOfDeliveryPacket})
let receivedProodOfDeliveryMessage = receivedProofOfDelivery.readMessage()
let receivedProofOfDeliveryMeta = receivedProofOfDelivery.readMeta()

// create transaction chain
const chain = new Chain({
  merchant: encoders.byteArrayToB64(Merchant.publicKey),
  customer: encoders.byteArrayToB64(Customer.publicKey),
  server: encoders.byteArrayToB64(Server.publicKey)
})

chain.setInvoice(receivedInvoiceMeta, receivedInvoiceMessage)
chain.setPromiseOfPayment(receivedPromiseOfPaymentMeta)
chain.setEscrowContract(receivedEscrowContractMeta)
chain.setProofOfDelivery(receivedProofOfDeliveryMeta)

chain._checkProofOfDelivery()
