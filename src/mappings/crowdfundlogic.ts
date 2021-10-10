import { log } from '@graphprotocol/graph-ts'
import {
  Contribution,
  FundingClosed
} from "../../generated/templates/CrowdfundLogic/CrowdfundLogic"
import {
  Contribution as ContributionEntity,
  Contributor as ContributorEntity,
  Crowdfund as CrowdfundEntity,
} from "../../generated/schema"

export function handleContribution(event: Contribution): void {
    const contributionId = event.transaction.hash.toHex()
    let contribution = ContributionEntity.load(contributionId)

    const crowdfundProxy = event.address.toHex()
    let crowdfund = CrowdfundEntity.load(crowdfundProxy)

    const contributorAddr = event.params.contributor.toHex()
    let contributor = ContributorEntity.load(contributorAddr)

    if(crowdfund) {

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
        log.error("There cannot be duplicate contributions.",[])
      }
      crowdfund.amountRaised = crowdfund.amountRaised.plus(event.params.amount)

      crowdfund.save()
    }
    else {
      log.error("A contribution to an unexisting crowdfund cannot be possible.",[])
    }

  }

export function handleFundingClosed(event: FundingClosed): void {

  const crowdfundProxy = event.address.toHex()
  let crowdfund = CrowdfundEntity.load(crowdfundProxy)

  if(crowdfund) {
    crowdfund.closed = true
    crowdfund.save()
  } else {
    log.error("Event of an unexisting crowdfund cannot be possible.",[])
  }
}