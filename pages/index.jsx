import { useEffect } from 'react'
import { Card, Button } from 'semantic-ui-react'
import Link from 'next/link'
import createInstance from '../ethereum/factory'

export default function Home({ campaigns }) {
  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link href={`/campaigns/${address}`}>
            <a>View campaign</a>
          </Link>
        ),
        fluid: true
      }
    })

    return <Card.Group items={items} />
  }

  return (
    <div>
      <h3>Open campaigns</h3>
      <Link href="/campaigns/new">
        <Button
          content="Create campaign"
          icon="add circle"
          primary
          floated="right"
        />
      </Link>
      {renderCampaigns()}
      <p style={{ marginTop: '10px' }}>
        DISCLAIMER: Make sure you have the Metamask extension installed and you
        are on the Rinkeby Test Network.
      </p>
    </div>
  )
}

export async function getServerSideProps() {
  const factory = await createInstance()
  const campaigns = await factory.methods.getDeployedCampaigns().call()

  return {
    props: {
      campaigns
    }
  }
}
