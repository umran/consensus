# Consensus: A Digital Payment Processor with Escrow Gurantees

This document specifies a business model for an escrow based payment processor for transactions between two parties that have little reason to trust each other to independently fulfill their commercial commitments. This document is written in the context of the Maldivian economy, with an awareness of the informal nature of commercial transactions that happen between individuals at high frequency. The document is divided into the following sections.

- A Discussion of the Target Market and the Demand for An Escrow Solution
  - The Target Market
  - The Demand for and Relevance of An Escrow Based Payment Processor
- A Discussion of the Solution We Propose
  - Abstract
  - Cryptographic Primitives
  - Process Flow and Logic

## Target Market and Demand for An Escrow Solution
### Target Market
The target market of the solution we propose are merchants who either

1) do not currently have a well enough established reputation to be able to accept credit card payments on demand for pending orders, or
2) operate at a small enough scale that makes it infeasible for them to integrate their point of sale with a payment gateway that would allow them to process credit card transactions, or
3) do not have the capacity to implement both point of sale machine payments as well as online payments since the two are currently being offered as separate services
4) do not have the sufficient technical resources to integrate with a payment gateway that would allow them to process credit card transactions online.

The type of merchant characterized by these conditions are plenty in the Maldives, with several individuals operating boutique retail establishments at an informal capacity, that is to say that a significant chunk of these establishments do not have a registered physical address nor do they, in some cases, have an official online address beyond their social media handles. The casual, informal nature of their commercial presence does not lend them the sort of authority that would inspire their customers to make payments on demand for pending orders. The small scale of their operations, on the other hand, makes it infeasible for them to implement a solution such as BML's digital payment gateway, which entails additional fixed costs as well as maintenance and development costs for implementation and operation. Moreover, these establishments are usually so small that they do not operate a website or other online application, which is usually a prerequisite for integration with online payment processors.

### Demand for and Relevance of An Escrow Based Payment Processor
Given that it would be infeasible for merchants in the target market to adopt traditional payment processors, what would an alternative payment service look like that would be desirable for these merchants and their customers? Any service looking for high adoption rates in this market should consider and address the 3 characteristics about the market enumerated in the section above.

In order to address characteristic 1) any potential alternative payment processor would have to give assurances to customers that their orders will be fulfilled after payment. When a client approaches an unknown seller under the traditional model, they might be reluctant to pay upfront for an order that they can't reasonably be sure will be fulfilled by the merchant. This is the primary reason an escrow service is appropriate for the market. A payment processor under an escrow model will still allow customers to pay upfront but, instead of going directly to the merchant, the funds will stay in escrow until the seller can fulfill the order.

Characteristic 2) requires that an alternative service be affordable, which in turn requires that the operations of an alternative service be uncomplicated and simple to administer. Direct payment gateways bear the incredible cost of securing transactions through compliance to industry standards set by credit card processors such as Visa and Mastercard. These standards, while secure, are somewhat archaic, from an efficiency point of view. Most of the infrastructure that such standards require are superfluous, given that smarter technologies are now available for securing digital assets. These standards are slow to update since most of the world's banking infrastructure rely on them and updating the standards would mean rolling them out to all the institutions that use them, which is a time consuming and tedious process. It is thus no surprise that direct payment gateways as offered by banks are expensive. An alternative service that aims to capture the target market should therefore look to build simpler, more secure systems on top of their infrastructure. We would still need to build on top of existing infrastructure because they provide us with the only interface to credit card payments.

Characteristic 3) requires that an alternative payment processor offers a service that does not fundamentally differentiate between physical and online terminals. In other words, payments should be processed under the same protocol whether it is a payment being made physically at the merchant's terminal or online. Thus such a service should bring the added versatility to the merchant that should they choose to take their business online, they can do so at no additional cost.

Characteristic 4) requires that any potential alternative payment processor can be adopted by merchants with relative ease, even by those without assets such as a website or a digital application. The only existing online payment gateway in Maldives requires merchants to integrate the payment gateway into their existing online assets by modifying the asset's endpoints. As we have said before, this is largely infeasible for the target market and so an alternative service should be able to serve merchants without requiring that they have a website or an app, and should definitely not expect the merchant to work with a complicated API in order to interface with the service.
