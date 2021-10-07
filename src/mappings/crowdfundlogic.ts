import { BigInt } from "@graphprotocol/graph-ts"

import {
  Contribution,
  FundingClosed
} from "../../generated/templates/CrowdfundLogic/CrowdfundLogic"

import {
  EditionCreated,
  EditionPurchased
} from "../../generated/templates/Editions/Editions"

import {
  Contribution as ContributionEntity,
  Contributor as ContributorEntity,
  Crowdfund as CrowdfundEntity,
} from "../../generated/schema"

import {
  TieredCrowdfundProxy,
} from "../../generated/CrowdfundFactory/TieredCrowdfundProxy"

export function handleContribution(event: Contribution): void {
    const contributionId = event.transaction.hash.toHex()
    let contribution = ContributionEntity.load(contributionId)

    const crowdfundProxy = event.address.toHex()
    let crowdfund = CrowdfundEntity.load(crowdfundProxy)

    const contributorAddr = event.params.contributor.toHex()
    let contributor = ContributorEntity.load(contributorAddr)

    if(crowdfund) {

      // TODO: Not working
      // let proxyContract = TieredCrowdfundProxy.bind(event.address);
      // crowdfund.editions = proxyContract.editions()
      // crowdfund.operatorPercent = proxyContract.operatorPercent()
      // crowdfund.fundingCap = proxyContract.fundingCap()


      if(!contributor) {
        contributor = new ContributorEntity(contributorAddr)
        contributor.save()
      }
      if (!contribution) {
        contribution = new ContributionEntity(contributionId)
        contribution.funds = event.params.amount
        contribution.crowdfund = crowdfundProxy
        contribution.contributor = contributorAddr
        contribution.save()
      } else {
        throw "There cannot be duplicate contributions."
      }
      crowdfund.amountRaised = crowdfund.amountRaised.plus(event.params.amount)

      crowdfund.save()
    }
    else {
      throw "A contribution to an unexisting crowdfund cannot be possible."
    }

  }

export function handleFundingClosed(event: FundingClosed): void {

  const crowdfundProxy = event.address.toHex()
  let crowdfund = CrowdfundEntity.load(crowdfundProxy)

  if(crowdfund) {
    crowdfund.closed = true
    if(crowdfund.amountRaised >= crowdfund.fundingCap) {
      crowdfund.funded = true
    }
  } else {
    throw "Event of an unexisting crowdfund cannot be possible."
  }
}