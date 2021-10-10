# MirrorGraph

A project for creating subgraphs for mirror.xyz contracts. Work in progress.

## Crowdfund factories

Deployer: `0x3527a204a5260a0e36ca695312379370328e4e6c`

Here's a list of retrieved CrowdfundFactories

| Date | Address| Start block |
|--|--|--|
| Jul-12-2021 | `0x224B867bA9dB850671f5a0Fc6B75A2A825Ce8e19` | 13199688 |
| Sep-10-2021 | `0xcA69d7aE5F6a5A3FdBB66b2C6cAA1a2928c7CD2f` | 12814081 |

## Retrieved ABIs

| Contract | ABI source | version |
|--|--|--|
| CrowdfundFactory | github: mirror-xyz/crowdfund | 4136e52dd2c25ae2c3489e79cdc2c8c54fc65e8b |
| CrowdfundLogic | github: mirror-xyz/crowdfund | 4136e52dd2c25ae2c3489e79cdc2c8c54fc65e8b |
| CrowdfundProxy | github: mirror-xyz/crowdfund | 4136e52dd2c25ae2c3489e79cdc2c8c54fc65e8b |
| CrowdfundStorage | github: mirror-xyz/editions-v1 | 4136e52dd2c25ae2c3489e79cdc2c8c54fc65e8b |
| Editions | github: mirror-xyz/editions-v1 | 62fdb5d7ddd717ff8c4b5ccb45efff31df9fef07 |
| TieredCrowdfundProxy | etherscan | 0x3c50E19C7aBF8E5c9A3C56FcE64E7015a6E1f49c |
| CrowdfundEditions | etherscan | 0xef3c951e22c65f6256746f4e227e19a5bcbf393c |


## Sample query

````
{
  crowdfunds {
    crowdfundProxy
    id
    name
    fundingCap
    closed
    amountRaised
    editionsContract{
      id
    }
    editions {
      id
    }
  }
  contributors {
    id
    contributions {
      funds
      crowdfund {
        name
      }
    }
    editionContributions {
      id
    }
  }
  editionContributions {
    id
    funds
    edition {
      id
    }
  }
  contributions {
    funds
    crowdfund {
      name
    }
  }
  editions {
   id
    quantity
    price
    sold
  }
}


```