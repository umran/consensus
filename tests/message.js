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

const mallory = '{"header":{"signature":"QsR5DZ7jjnwruRdgHDdPOGC0XonQwIfdNHKZ7lBb4ZAKyEwz/LfdePGze+SrS6kfV/HcQsrYjdMgyLMt3hm0AA==","ephemeralPublicKey":"5UcrQyGqhquHzxckAaoeFfZcnkjmaNWAaKhgYE/Ebe4=","ephemeralPublicKeyCertificate":"9NA9lbCmpl3mbW+/5eApNJWQrF4KIbINeGSDp9m2AJBosyYrEGf2rd7TCKuV7Cpsh0+C8+eGXXFu1BriF4sJCg==","identityPublicKey":"alGZl6dwkjB9uGv3DfcsfmqBjH2QAhgtYlRqsxAuqpI="},"body":{"type":"invoice","txId":83,"merId":5549,"cusId":4893,"txValue":25.55,"txManifest":[{"id":3240,"name":"Hummus","qty":1,"price":5.55},{"id":5443,"name":"Chicken Shish-Tawouk","qty":2,"price":10}]}}'

let receivedInvoice = new Invoice('receive', mallory)
console.log(receivedInvoice.readMessage())
console.log(receivedInvoice.readMeta())
