import web3 from './web3'
import compiledFactory from './build/Campaign.json'

export default async function getActiveCampaign(address) {
  return new web3.eth.Contract(compiledFactory.abi, address)
}
