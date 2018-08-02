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
  - Protocols and Logic

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

Characteristic 4) demands that any potential alternative payment processor can be adopted by merchants with relative ease, even by those without assets such as a website or a digital application. The only existing online payment gateway in Maldives requires merchants to integrate the payment gateway with their existing online assets by modifying the asset's endpoints. As we have said before, this is largely infeasible for the target market and so an alternative service should be able to serve merchants without requiring that they have a website or an app, and should definitely not expect the merchant to work with a complicated API in order to interface with the service.

## The Solution We Propose
### Abstract
The business model and protocol we propose here is tailored to the target market discussed in the previous section. The primary service it offers is a way for merchants to accept digital payments without directly interfacing with card issuers. The way we enable that is by handling card transactions between customers on our end, keeping track of their payments to merchants, and then directing the funds to merchants accordingly. Collecting payment for any given transaction from the customer by handling card transactions on our end puts us in a unique position to hold those funds in escrow. It allows us to apply an escrow protocol that ensures that the two parties have fulfilled their commercial contract as the logic that directs the funds. Please refer below for an example transaction.

### An Example Transaction
When a customer wants to make a purchase, the merchant issues a digitally signed invoice that authenticates themselves and sends the invoice to the customer. The customer checks the merchant signature, then signs the invoice, authenticating themselves and sends the invoice to the payment processor, indicating their intent to undertake the transaction. The payment processor checks the signatures of both the customer and the merchant, and if the signatures check out, determines that they have entered into a contract to make the transaction. The payment processor then prompts the customer to make the relevant payment via credit/debit card. This is done through the payment processor's implementation of an existing online payment gateway, such as BML's payment gateway. Upon completion of the payment, the payment gateway creates a signed entry in its logs attesting that the customer has paid the relevant amount in order to fulfill their part of the contract entered into with the merchant. A copy of this entry is sent to the merchant so that they may confirm that the customer has completed the payment. The merchant then delivers the goods, along with a signed receipt, which the customer signs and sends to the payment processor, indicating that the order has been fulfilled by the merchant. The payment processor then creates a signed entry in its logs attesting that the funds pertaining to the transaction have been released to the merchant. The merchant then claims these funds by appeal to the strong cryptographic evidence attesting that the transaction has been fulfilled. The payment processor settles the funds via bank transfer or similar service.
