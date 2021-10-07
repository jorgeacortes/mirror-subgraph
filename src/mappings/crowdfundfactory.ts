import { BigInt, Bytes, DataSourceTemplate } from "@graphprotocol/graph-ts"
import {
  CrowdfundFactory,
  CrowdfundDeployed
} from "../../generated/CrowdfundFactory/CrowdfundFactory"

import {
  TieredCrowdfundProxy,
} from "../../generated/CrowdfundFactory/TieredCrowdfundProxy"

import { Crowdfund } from "../../generated/schema"

export function handleCrowdfundDeployed(event: CrowdfundDeployed): void {

  const crowdfundId = event.params.crowdfundProxy.toHex()
  let entity = Crowdfund.load(crowdfundId)

  if (!entity) {
    entity = new Crowdfund(crowdfundId)

    entity.operator = event.params.operator
    entity.crowdfundProxy = event.params.crowdfundProxy
    entity.name = event.params.name
    entity.symbol = event.params.symbol

    entity.funded = false
    entity.closed = false
    entity.amountRaised = BigInt.fromI32(0)

    entity.editions = new Bytes(0)
    entity.operatorPercent = BigInt.fromI32(0)
    entity.fundingCap = BigInt.fromI32(0)

    // Register a crowdfundlogic associated to the new crowdfund to track its events
    DataSourceTemplate.create("CrowdfundLogic", [crowdfundId])

    // TODO: Not working. The idea is to register the proxy and get the Editions contract, but it doesn't work.
    
    // let proxyContract = TieredCrowdfundProxy.bind(event.params.crowdfundProxy);

    // entity.editions = proxyContract.editions()
    // entity.operatorPercent = proxyContract.operatorPercent()
    // entity.fundingCap = proxyContract.fundingCap()

    // let proxyContract = CrowdfundFactory.bind(event.address);
    // const params = proxyContract.parameters()
    // entity.fundingCap = params.value2
    // entity.operatorPercent = params.value3

    // Register an editions associated to the new Editions contract to track its events
    // DataSourceTemplate.create("Editions", [proxyContract.editions().toHex()])
  }

  entity.save()
}