# Tithe

## A decentralized blockchain solution for non-profit donation transparency.

### The Why
Tithe’s mission is to alleviate non-profit corruption. All those Bugatti’s bought with non-profit money? Rest assured, Tithe to the rescue! With Tithe, donors have full access to the transactions that non-profits make as well as the donations that flow into the non-profits. This transparency will incentivize donors to put their money where it really matters and this will incentivize non-profits to be transparent because donors will either donate through Tithe or not at all.

### The How

Tithe utilizes IPFS to provide a decentralized file storage system on a separate blockchain. These files will be accessible by any donor through a simple API, which will expose both input and output transaction information, i.e., donors will be able to see their transactions on the blockchain, as well as transactions that transfer those funds off the blockchain for spending by the non-profit, thus providing full transparency.

Tithe implements a Django web application that exposes a simple API for referencing the blockchain for all purposes. For donors, a RESTful API is provided for querying the state of their donation, and the donation tracking information. For the NPO, an API is provided for automated configuration and deployment of NPO smart contracts on ethereum, specific to their NPO. These smart contracts handle transactions onto and off of IPFS, and can be called for spending and data reports through a RESTful API exposed by Django. Additionally, the Django web app provides an API interface for donors to query for transaction history.

The API then exposes all the necessary functionality to implement user interfaces for Tithe, web based, mobile, and even for 3rd party developers and for consumption by other applications and systems.

<p align="center">
  <img src="https://github.com/williampsmith/Tithe/blob/master/Assets/architecture.png">
  <br/>
</p>

### Contracts

#### NPO
Manage the NPO itself, including transactions and other future features deemed useful by the non-profit, and configured by the configure Contract
mapping (string => Donations[])
spendBalance(amount, to): can only be called by owner of contract, keep track of where the money went in a data structure and whose money (trust that the owner provides a valid “to” for now?)
getDonated(donor): returns total donated by the donor
getBalance(donor): returns unused donated balance
donate(category): get amount from msg.value

#### CONFIG
```
Struct NPO {
  String org_name
  Sting org_id
  address addr
  String[] tags
  String[] buckets
}
```

NonProfits: `mapping (name => NPO)`

`Register()`: Deploys a NPO contract for each new non-profit, Mapping ID or Non-profit Name to Donations contract
`GetNPOAddress(name)`: get NPO contract address of the non-profit named name


#### DONATIONS
```
Struct Donation {
	uint256 amount
	String usedFor
	NPO
	// others that we may add later
}
```

Donations: `Mapping (address => Donation[])`

Map donor to mapping of donation to non-profit contract identifier and some key that associates with the transaction itself
GetTransactions(donor): read from data structure to see where the money went and how much
MakeDonation(npo, amount) (payable): makes a payment of AMOUNT to NPO. Returns true if successful, else false.


### Django API

`GET /api/v1/donor/donation/`
Returns donation tracking info from donor

#### Parameters:
`String donor_id` -- donor public key
`(optional) String donation_id` -- donation hash key.


---


`POST /api/v1/npo/config/`
Configures a new NPO contract with the provided configuration options. Returns an org_id, and updates the data structures in the config contract to make the NPO searchable.

#### Parameters:
`String org_name` -- 501(c)(3) registered name of NPO
`String statement` -- Summary of what your non-profit does. This will be what prospective donors see about your NPO in search results.
`String[] tags` -- list of tags to make your NPO more easily discoverable by prospective donors.
.
.
.


----


`GET /api/v1/donor/search/`
Provides discoverability of NPO’s based on criteria such as search phrases and NPO name.

`(optional) String q` -- search string. Will perform a relevance search by tag string matching.
`(optional) String org_name` -- Search for information of NPO that corresponds to the provided org_name
`(optional) String org_key` -- Search for information of NPO that corresponds to the provided org_id


----


`POST /api/v1/donor/login/`
Login and return session token for caching

#### Parameters
`String donor_id`
`String pw_hash`


----



`POST /api/v1/npo/login/`
Login and return session token for caching

#### Parameters
`String org_id`
`String pw_hash`


----


`POST /api/v1/npo/withdraw/`
Performs a spend transaction of the specified amount between the NPO and the specified account, from the specified spend bucket.

#### Parameters
`String org_id`
`String session_key` -- key of open authenticated session
`String bucket` -- bucket from which you wish to withdraw
`Int amount` -- amount in wei


----


`POST /api/v1/npo/donate/`
Performs a donate transaction of the specified amount between the donor and the specified NPO.

#### Parameters
`String donor_id`
`String session_key` -- key of open authenticated session
`Int amount` -- amount in wei
`(optional) String bucket` -- bucket from which you wish funds to be spent. If not provided, can be spent freely.
