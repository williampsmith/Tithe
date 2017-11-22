# Tithe

## A decentralized blockchain solution for non-profit donation transparency.

### The Why
Tithe’s mission is to alleviate non-profit corruption. All those Bugatti’s bought with non-profit money? Rest assured, Tithe to the rescue! With Tithe, donors have full access to the transactions that non-profits make as well as the donations that flow into the non-profits. This transparency will incentivize donors to put their money where it really matters and this will incentivize non-profits to be transparent because donors will either donate through Tithe or not at all.

### The How

Tithe utilizes IPFS to provide a decentralized file storage system on a separate blockchain. These files will be accessible by any donor through a simple API, which will expose both input and output transaction information, i.e., donors will be able to see their transactions on the blockchain, as well as transactions that transfer those funds off the blockchain for spending by the non-profit, thus providing full transparency.

Tithe implements a Django web application that exposes a simple RESTful API for automated configuration and deployment of smart contracts on ethereum via web3.py. Automated deployment
is enabled via a Deploy contract, which generates new smart contracts on call from web3.py.
These smart contracts handle transactions onto and off of IPFS. Additionally, the Django web app provides a RESTful API interface for donors to query for transaction history.

<p align="center">
  <img src="https://github.com/williampsmith/Tithe/blob/master/Assets/architecture.png">
  <br/>
</p>
