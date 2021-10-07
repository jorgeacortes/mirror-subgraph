# MirrorGraph

A project for creating subgraphs for mirror.xyz contracts. Work in progress.

## Retrieved ABIs

| Contract | ABI source | version |
|--|--|--|
| CrowdfundFactory | github: mirror-xyz/crowdfund | 4136e52dd2c25ae2c3489e79cdc2c8c54fc65e8b |
| CrowdfundLogic | github: mirror-xyz/crowdfund | 4136e52dd2c25ae2c3489e79cdc2c8c54fc65e8b |
| CrowdfundProxy | github: mirror-xyz/crowdfund | 4136e52dd2c25ae2c3489e79cdc2c8c54fc65e8b |
| CrowdfundStorage | github: mirror-xyz/editions-v1 | 4136e52dd2c25ae2c3489e79cdc2c8c54fc65e8b |
| Editions | github: mirror-xyz/editions-v1 | 62fdb5d7ddd717ff8c4b5ccb45efff31df9fef07 |
| TieredCrowdfundProxy | etherscan | 0x3c50E19C7aBF8E5c9A3C56FcE64E7015a6E1f49c |


## Sample query

````
{
  contributions(first:1){
    id
    funds
    contributor {
      id
    }
    crowdfund{
      id
      name
    }
  }
  crowdfunds {
    id
    operator
    crowdfundProxy
    name
    symbol
    contributors(first:1) {
      id
      funds
    }
    funded
    amountRaised
    closed
    editions
    fundingCap
    operatorPercent
  }
  contributors(first:5) {
    id
    contributions {
      crowdfund {
        name
        
      }
    }
  }
  editions(first:5){
    id
    quantity
    price
    sold
    crowdfund {
      name
    }
    editionId
  }
}

```