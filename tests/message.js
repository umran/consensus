const Invoice = require('../src/messages').Invoice
const crypto = require('../src/crypto')

const idKeys = crypto.generateIdKeys()

const data = JSON.parse('{"orderId":"1234983940982098123498394098209812349883940982098123498394098209","manifest":[{"item":"chicken korma","quantity":2,"price":20,"tax":0.1},{"item":"garlic naan","quantity":6,"price":4,"tax":0.1}],"totalPreTax":64,"totalPostTax":67.2}')

let invoice = new Invoice('send', idKeys)
invoice.write(data)

const packet = invoice.generate()
const meta = invoice.readMeta()

console.log(packet)
console.log(meta)

const mallory = '{"header":{"signature":"uKBwZuAjZ/h24EOXAyKDHHWq793YgzaHYhTbp7CStOxI/kJ2uPbh2LgbvZ7emlnOH2poaRkoASLq9SdRWuQHCA==","ephemeralPublicKey":"q1hLgbbu/UZKOzMeNbcfRVWiOgLIXuylJpMXsaWLWvs=","ephemeralPublicKeyCertificate":"y3z6PxKa5LoZutcyH0/wbnTTDDaBcMqRp087hGD61UZBl+9s5jNxosxBTlSriFv6lUQuqNIoM1b9dDN/acVUCw==","identityPublicKey":"U7pKr5iWM8Z/QSsLvupXzu/rkTqbuExIgb4fTQtJBjI="},"body":{"orderId":"1234983940982098123498394098209812349883940982098123498394098209","manifest":[{"item":"chicken korma","quantity":2,"price":20,"tax":0.2},{"item":"garlic naan","quantity":6,"price":4,"tax":0.1}],"totalPreTax":64,"totalPostTax":67.2}}'

let receivedInvoice = new Invoice('receive', mallory)
console.log(receivedInvoice.readMessage())
console.log(receivedInvoice.readMeta())
