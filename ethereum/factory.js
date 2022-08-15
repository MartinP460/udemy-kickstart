import web3 from './web3'
import compiledFactory from './build/CampaignFactory.json'

const createInstance = async () => {
  const instance = await new web3.eth.Contract(
    compiledFactory.abi,
    process.env.DEPLOYED_FACTORY_CAMPAIGNS_CONTRACT
  )
  return instance
}

export default createInstance
