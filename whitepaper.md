# Consensus: An Online Payment Processor with Escrow Gurantees

This document specifies a business model for an escrow based payment processor for transactions between two parties that have little reason to trust each other to independently fulfill their commercial commitments. This document is written in the context of the Maldivian economy, with an awareness of the informal nature of commercial transactions that happen between individuals at high frequency. The document is divided into the following sections.

- A Discussion of the Target Market and the Demand for An Escrow Solution
  - The Target Market
  - The Relevance of an Escrow Based Payment Processor
- A Discussion of the Solution We Propose
  - Abstract
  - Cryptographic Primitives
  - Process Flow and Logic

## Target Market and Demand for An Escrow Solution
### Target Market
The target market of the solution we propose are merchants who either

1) do not currently have a well enough established reputation to be able to accept credit card payments on demand for pending orders, or
2) operate at a small enough scale that makes it infeasible for them to integrate their point of sale with a payment gateway that would allow them to process credit card transactions, or
3) do not have the sufficient technical resources to integrate with a payment gateway that would allow them to process credit card transactions.

The type of merchant characterized by these conditions are plenty in the Maldives, with several individuals operating boutique retail establishments at an informal capacity, that is to say that a significant chunk of these establishments do not have a registered physical address nor do they, in some cases, have an official online address beyond their social media handles. The casual, informal nature of their commercial presence does not lend them the sort of authority that would inspire their customers to make payments on demand for pending orders. The small scale of their operations, on the other hand, makes it unfeasible for them to implement a solution such as BML's online payment gateway, which entails additional fixed costs as well as maintenance and development costs for implementation and operation. Moreover, these establishments are usually so small that they do not operate a website or other online application, which is usually a prerequisite for integration with online payment processors.

### Demand for An Escrow Solution
Given that it would be unfeasible for merchants in the target market to adopt traditional payment processors, what would an alternative payment service look like that would be desirable for these merchants and their customers? Any service looking for high adoption rates in this market should consider and address the 3 characteristics about the market enumerated in the section above.
