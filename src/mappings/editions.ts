import { BigInt } from "@graphprotocol/graph-ts"

import {
  EditionCreated,
  EditionPurchased
} from "../../generated/templates/Editions/Editions"

import {
  Contribution as ContributionEntity,
  Contributor as ContributorEntity,
  Crowdfund as CrowdfundEntity,
  Edition as EditionsEntity
} from "../../generated/schema"

export function handleEditionCreated(event: EditionCreated): void {
  const crowdfundProxy = event.address.toHex()
  let crowdfund = CrowdfundEntity.load(crowdfundProxy)
  if(crowdfund) {
    crowdfund.editions = event.address
    const edition = new EditionsEntity(crowdfundProxy+event.params.editionId.toHex())
    edition.price = event.params.price
    edition.quantity = event.params.quantity
    edition.sold = BigInt.fromI32(0)
    edition.editionId = event.params.editionId
    edition.crowdfund = crowdfundProxy
  } else {
    throw "Event of an unexisting crowdfund cannot be possible."
  }
}

export function handleEditionPurchased(event: EditionPurchased): void {
  const editionEntityId = event.address.toHex()+event.params.editionId.toHex()
  let edition = EditionsEntity.load(editionEntityId)

  if(!edition) {
    throw "Event of an unexisting edition cannot be possible."
  } else {
    const crowdfundProxy = event.address.toHex()
    let crowdfund = CrowdfundEntity.load(crowdfundProxy)
    if(!crowdfund) {
      throw "Event of an unexisting crowdfund cannot be possible."
    } else {
      edition.sold = edition.sold.plus(event.params.numSold)
      const expent = event.params.numSold.times(edition.price)
      crowdfund.amountRaised = crowdfund.amountRaised.plus(expent)
    }
  }
}