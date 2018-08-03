# Consensus: A Digital Payment Processor That Doubles as an Escrow Service

* **Author:** Ahmed Umran Hussain
* **Date:** 2018-08-01
* **Revision:** 00 (work in progress)
* **Copyright:** Irukandji Labs 2018

This document specifies a business model for an escrow based payment processor for transactions between two parties that have little reason to trust each other to independently fulfill their commercial commitments. This document is written in the context of the Maldivian economy, with an awareness of the informal nature of commercial transactions that happen between individuals at high frequency. The document is divided into the following sections.

- A Discussion of the Target Market and the Demand for an Escrow Solution
  - The Target Market
  - The Demand for and Relevance of an Escrow Based Payment Processor
- A Discussion of the Solution We Propose
  - Abstract
  - An Example Transaction
  - Cryptographic Primitives
  - The Consensus Escrow Protocol

## Target Market and Demand for an Escrow Solution
### Target Market
The target market of the solution we propose are merchants who either

1) do not currently have a well enough established reputation to be able to accept credit card payments on demand for pending orders, or
2) operate at a small enough scale that makes it infeasible for them to integrate their point of sale with a payment gateway that would allow them to process credit card transactions, or
3) do not have the capacity to implement both point of sale machine payments as well as online payments since the two are currently being offered as separate services, or
4) do not have the sufficient technical resources to integrate existing digital assets with a payment gateway that would allow them to process credit card transactions online.

The type of merchant characterized by these conditions are plenty in the Maldives, with several individuals operating boutique retail establishments at an informal capacity, that is to say that a significant chunk of these establishments do not have a registered physical address nor do they, in some cases, have an official online address beyond their social media handles. The casual, informal nature of their commercial presence does not lend them the sort of authority that would inspire their customers to make payments on demand for pending orders. The small scale of their operations, on the other hand, makes it infeasible for them to implement a solution such as BML's digital payment gateway, which entails additional fixed costs as well as maintenance and development costs for implementation and operation. Moreover, these establishments are usually so small that they do not operate a website or other online application, which is usually a prerequisite for integration with online payment processors.

### Demand for and Relevance of an Escrow Based Payment Processor
Given that it would be infeasible for merchants in the target market to adopt traditional payment processors, what would an alternative payment service look like that would be desirable for these merchants and their customers? Any service looking for high adoption rates in this market should consider and address the 4 characteristics about the market enumerated in the section above.

Characteristic 1) demands that an alternative payment processor give assurances to customers that their orders will be fulfilled after payment. When a client approaches an unknown seller under the traditional model, they might be reluctant to pay upfront for an order that they can't reasonably be sure will be fulfilled by the merchant. This is the primary reason an escrow service is appropriate for the market. A payment processor under an escrow model will still allow customers to pay upfront but, instead of going directly to the merchant, the funds will stay in escrow until the seller can fulfill the order.

Characteristic 2) demands that an alternative service be affordable, which in turn requires that the operations of an alternative service be uncomplicated and simple to administer. Direct payment gateways bear the incredible cost of securing transactions through compliance to industry standards set by credit card processors such as Visa and MasterCard. These standards, while secure, are somewhat archaic, from an efficiency point of view. Most of the infrastructure that such standards require are superfluous, given that simpler and smarter technologies are now available for securing digital assets. These standards are slow to update since most of the world's banking infrastructure rely on them and updating these standards would mean rolling them out to all the institutions that use them, which is a time consuming and tedious process. It is thus no surprise that direct payment gateways as offered by banks are expensive. An alternative service that aims to capture the target market should therefore look to build simpler, more secure systems on top of existing infrastructure. We would still need to build on top of existing infrastructure because they provide us with the only interface for processing credit card payments.

Characteristic 3) demands that an alternative payment processor offers a service that does not fundamentally differentiate between physical and online terminals. In other words, payments should be processed under the same protocol whether it is a payment being made physically at the merchant's terminal or online. Thus such a service should bring the added versatility to the merchant that should they choose to take their business online, they can do so at no additional cost.

Characteristic 4) demands that an alternative payment processor can be adopted by merchants with relative ease, even by those without assets such as a website or a digital application. The only existing online payment gateway in Maldives requires merchants to integrate the payment gateway with their existing online assets by modifying the asset's endpoints. As we have said before, this is largely infeasible for the target market and so an alternative service should be able to serve merchants without requiring that they have a website or an app, and should definitely not expect the merchant to work with a complicated API in order to interface with the service.

## The Solution We Propose
### Abstract
The business model and protocol we propose here is tailored to the target market discussed in the previous section. The primary service it offers is a way for merchants to accept digital payments without directly interfacing with card issuers. The way we enable that is by handling card transactions of customers on our end, keeping track of their payments to merchants, and then directing the funds to merchants accordingly. Collecting payment for any given transaction from the customer by handling card transactions on our end puts us in a unique position to hold those funds in escrow. It allows us to apply an escrow protocol that ensures that the two parties have fulfilled their commercial contract as the logic that directs the funds. Please refer below for an example transaction.

### An Example Transaction
When a customer wants to make a purchase, the merchant issues a digitally signed invoice that authenticates themselves and sends the invoice to the customer. The customer checks the merchant signature, then signs the invoice, authenticating themselves and sends the invoice to the payment processor, indicating their intent to undertake the transaction. The payment processor checks the signatures of both the customer and the merchant, and if the signatures check out, determines that they have entered into a contract to make the transaction. The payment processor then prompts the customer to make the relevant payment via credit/debit card. This is done through the payment processor's implementation of an existing online payment gateway, such as BML's payment gateway. Upon completion of the payment, the payment gateway creates a signed entry in its logs attesting that the customer has paid the relevant amount in order to fulfill their part of the contract entered into with the merchant. A copy of this entry is sent to the merchant so that they may confirm that the customer has completed the payment. The merchant then delivers the goods, along with a signed receipt, which the customer signs and sends to the payment processor, indicating that the order has been fulfilled by the merchant. The payment processor then creates a signed entry in its logs attesting that the funds pertaining to the transaction have been released to the merchant. The merchant then claims these funds by appeal to the strong cryptographic evidence attesting that the transaction has been fulfilled. The payment processor settles the funds via bank transfer or similar service.

### Cryptographic Primitives
Digital signatures are the primary cryptographic primitive used in this service. Digital signatures are used for the authentication of users and for checking the integrity of messages.

Each party has a unique identity key pair (a private key and a public key) associated with them, that is used to authenticate themselves. An Identity key pair is long-lived and its private key remains a secret known only to the owner of the key.

Transactions take place as a series of messages between the parties involved. Every message is digitally signed by a random unique key known as an ephemeral key. All ephemeral keys used for signing messages are in turn signed using identity keys that authenticate the respective sender. Ephemeral keys are discarded after signing its message and are never reused.

The specific signature scheme that will be used in this service is `ed25519`. This particular variant was chosen for its speed, robust security and small signature size. It offers a good mix of high security and efficiency, which is ideal for a payment service that relies on the frequent generation and transmission of keys and signatures. Click [here](https://ed25519.cr.yp.to/) for more information on `ed25519`.

### The Consensus Escrow Protocol
The Consensus Escrow Protocol is the primary protocol that will be used in transactions between customers and merchants.

The parties involved in the protocol are as follows:

- Merchant
- Payment Processor
- Customer

The protocol is defined by the following sequence of messages:

1) The merchant initiates the protocol by generating a `Signed Invoice` for the order. The merchant then sends the `Signed Invoice` to the customer and the payment processor.

2) The customer checks the contents of the `Signed Invoice` and verifies the merchant's signature. The customer then generates a `Signed Promise of Payment` that references the `Signed Invoice` and sends it to the merchant and the payment processor.

3) The payment processor checks the contents of the `Signed Promise of Payment`, verifies the customer's signature then checks the contents of the `Signed Invoice` it references and checks the merchant's signature. If the chain between the `Signed Invoice`and `Signed Promise of Payment` is verified, the payment processor deducts the value of the order from the customer's account (by either prompting an online credit card transaction or using the customer's prepaid funds). The payment processor then creates a `Signed Escrow Contract`, referencing the `Signed Promise of Payment` and sends it to both the merchant and the customer, who verify the contract independently.

4) The merchant delivers the goods to the customer upon which the customer produces a `Signed Proof of Delivery` referencing the `Signed Escrow Contract`and sends it to both the merchant and the payment processor.

5) The payment processor checks the contents of the `Signed Proof of Delivery` and verifies the customer's signature before releasing the funds to the merchant.
