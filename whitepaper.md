# Consensus: An Online Payment Processor with Escrow Gurantees

This document specifies a business model for an escrow based payment processor for transactions between two parties that have little reason to trust each other to independently fulfill their commercial commitments. This document is written in the context of the Maldivian economy, with an awareness of the informal nature of commercial transactions that happen between individuals at high frequency. The document is divided into the following sections.

- A Discussion of the Target Market and the Demand for an Escrow Solution
  - The Target Market
  - The Relevance of an Escrow Based Payment Processor
- A Discussion of the Solution We Propose
  - Abstract
  - Cryptographic Primitives
  - Process Flow and Logic

## The Target Market
The target market of the solution we propose are merchants who either
1) do not currently have a well enough established reputation to be able to accept credit card payments on demand for orders placed by clients, or
2) operate at a small enough scale that makes it infeasible for them to integrate their point of sale with a payment gateway that would allow them to process credit card transactions, or
3) do not have the sufficient technical resources to integrate with a payment gateway that would allow them to process credit card transactions.
