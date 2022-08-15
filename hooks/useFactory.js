import { useState, useEffect } from 'react'
import web3 from '../ethereum/web3'
import CampaignFactory from '../ethereum/build/CampaignFactory.json'

export default function useFactory() {
  const [instance, setInstance] = useState(null)

  useEffect(() => {
    const initiateFactory = async () => {
      const campaignFactory = await new web3.eth.Contract(
        CampaignFactory.abi,
        '0x0d28766eC24E77099bf62eFbd7De15C2Ed68fdE9'
      )
      setInstance(campaignFactory)
    }
    initiateFactory()
  }, [])

  return instance
}
