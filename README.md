# Tithe

## A decentralized blockchain solution for non-profit donation transparency.

### The Why
Tithe’s mission is to alleviate non-profit corruption. All those Bugatti’s bought with non-profit money? Rest assured, Tithe to the rescue! With Tithe, donors will have full access to the transactions that non-profits make as well as the donations that flow into the non-profits. This transparency will incentivize users to put their money where it really matters and this will incentivise non-profits to be transparent because users will either donate through the dApp or not at all.

### The How

Tithe utilizes IPFS to provide a decentralized file storage system on a separate blockchain. These files will be accessible by any donor through a simple API, which will expose both input and output transaction information, i.e., donors will be able to see their transactions on the blockchain, as well as transactions that transfer those funds off the blockchain for spending by the non-profit, thus providing full transparency.

Tithe implements a Django web application that exposes  a simple RESTful API for automated configuration and deployment of smart contracts on ethereum. These smart contracts handle transactions onto and off of IPFS. Additionally, the Django web app provides a RESTful API interface for donors to query for transaction history.

<p align="center">
  <img src="https://github.com/williampsmith/Tithe/blob/master/Assets/architecture.png">
  <br/>
</p>
