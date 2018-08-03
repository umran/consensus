const Invoice = require('../src/Messages/Invoice')
const crypto = require('../src/crypto')

const idKeys = crypto.generateIdKeys()

const data = {
  type: 'invoice',
  txId: 0123,
  merId: 5549,
  cusId: 4893,
  txValue: 25.55,
  txManifest: [{id: 3240, name: "Hummus", qty: 1, price: 5.55}, {id: 5443, name: "Chicken Shish-Tawouk", qty: 2, price: 10}]
}

let invoice = new Invoice('send', idKeys)
invoice.write(data)

const packet = invoice.generate()
const meta = invoice.readMeta()

console.log(packet)
console.log(meta)

let receivedInvoice = new Invoice('receive', packet)
console.log(receivedInvoice.readMessage())
console.log(receivedInvoice.readMeta())
