import { BigInt, log, DataSourceTemplate } from "@graphprotocol/graph-ts"
import {
  CrowdfundFactory,
  CrowdfundDeployed
} from "../../generated/CrowdfundFactory/CrowdfundFactory"
import {
  TieredCrowdfundProxy,
} from "../../generated/CrowdfundFactory/TieredCrowdfundProxy"
import { Crowdfund, EditionsContract } from "../../generated/schema"

export function handleCrowdfundDeployed(event: CrowdfundDeployed): void {

  const crowdfundId = event.params.crowdfundProxy.toHex()
  let entity = Crowdfund.load(crowdfundId)

  if (!entity) {
    entity = new Crowdfund(crowdfundId)

    entity.operator = event.params.operator
    entity.crowdfundProxy = event.params.crowdfundProxy
    entity.name = event.params.name
    entity.symbol = event.params.symbol

    entity.closed = false
    entity.amountRaised = BigInt.fromI32(0)

    entity.operatorPercent = BigInt.fromI32(0)
    entity.fundingCap = BigInt.fromI32(0)

    // Register a crowdfundlogic associated to the new crowdfund to track its events
    DataSourceTemplate.create("CrowdfundLogic", [crowdfundId])

    // Register data from the CrowdfundProxy not available at the event
    let proxyContract = TieredCrowdfundProxy.bind(event.params.crowdfundProxy);
    const editionsId = proxyContract.editions().toHex()
    entity.editionsContract = editionsId
    entity.operatorPercent = proxyContract.operatorPercent()
    entity.fundingCap = proxyContract.fundingCap()
    entity.save()

    // Register an editions associated to the new Editions contract to track its events
    let editions = EditionsContract.load(editionsId)
    if(!editions) {
      editions = new EditionsContract(editionsId)
      editions.save()
      DataSourceTemplate.create("CrowdfundEditions", [editionsId])
    } else {
      log.info("Editions already tracked: {}", [editionsId])
    }
  } else {
    log.critical("Duplicate crowdfund detected! {}", [crowdfundId])
  }
}