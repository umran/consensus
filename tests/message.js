const Invoice = require('../src/messages').Invoice
const crypto = require('../src/crypto')

const idKeys = crypto.generateIdKeys()

const data = {
  orderId: "1234983940982098123498394098209812349883940982098123498394098209",
  manifest:[
    { item: "chicken korma", quantity: 2, price: 20, tax: 0.1 },
    { item: "garlic naan", quantity: 6, price: 4, tax: 0.1 }
  ],
  totalPreTax: 64,
  totalPostTax: 67.2
}

let invoice = new Invoice({type: 'send', identityKeys: idKeys})
invoice.write(data)

const packet = invoice.generate()
const meta = invoice.readMeta()

console.log(packet)
console.log(meta)

let receivedInvoice = new Invoice({type: 'receive', packet: packet})
console.log(receivedInvoice.readMessage())
console.log(receivedInvoice.readMeta())
