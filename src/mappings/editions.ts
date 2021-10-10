import { BigInt, log } from "@graphprotocol/graph-ts"
import {
    EditionCreated,
    EditionPurchased
  } from "../../generated/templates/CrowdfundEditions/CrowdfundEditions"
import {
  Contributor as ContributorEntity,
  Crowdfund as CrowdfundEntity,
  Edition as EditionsEntity,
  EditionContribution as EditionContributionEntity
} from "../../generated/schema"


function getEditionUniqueId(address:string, editionId:string): string {
  return address+'-'+editionId
}

export function handleEditionCreated(event: EditionCreated): void {
  const crowdfundProxy = event.params.fundingRecipient.toHex()
  let crowdfund = CrowdfundEntity.load(crowdfundProxy)
  if(crowdfund) {
    const editionID = getEditionUniqueId(event.address.toHex(), event.params.editionId.toHex())
    let edition = new EditionsEntity(editionID)
    edition.address = event.address.toHex()
    edition.price = event.params.price
    edition.quantity = event.params.quantity
    edition.sold = BigInt.fromI32(0)
    edition.editionId = event.params.editionId
    edition.crowdfund = crowdfundProxy // equivalent to fundingRecipient
    edition.contributors = new Array<string>()
    edition.save()
  } else {
    log.error("Event of an unexisting crowdfund cannot be possible.",[])
  }
}

export function handleEditionPurchased(event: EditionPurchased): void {
  const editionEntityId = getEditionUniqueId(event.address.toHex(), event.params.editionId.toHex())
  let edition = EditionsEntity.load(editionEntityId)

  if(!edition) {
    log.error("Event of an unexisting edition cannot be possible.",[])
  } else {
    let crowdfund = CrowdfundEntity.load(edition.crowdfund)
    if(!crowdfund) {
      log.error("Event of an unexisting crowdfund cannot be possible.",[])
    } else {
      const contributorId: string = event.params.buyer.toHex()
      let contributor = ContributorEntity.load(contributorId)
      if(!contributor) {
        contributor = new ContributorEntity(contributorId)
        contributor.save()
      }

      const editionContributionId = event.transaction.hash.toHex()
      let editionContribution = EditionContributionEntity.load(editionContributionId)
      if(!editionContribution){
        editionContribution = new EditionContributionEntity(editionContributionId)
        editionContribution.contributor = contributorId
        editionContribution.edition = editionEntityId
        editionContribution.funds = edition.price
        editionContribution.save()
      } else {
        log.error("Duplicated edition purchase.",[])
      }

      let contributors = edition.contributors
      if(contributors) {
        contributors.push(contributorId)
      } else {
        contributors = [contributorId]
      }
      edition.contributors = contributors

      edition.sold = edition.sold.plus(BigInt.fromI32(1))
      crowdfund.amountRaised = crowdfund.amountRaised.plus(edition.price)

      edition.save()
      crowdfund.save()
    }
  }
}