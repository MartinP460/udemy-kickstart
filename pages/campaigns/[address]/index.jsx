import { Card, Grid, Button } from 'semantic-ui-react'
import Link from 'next/link'
import ContributeForm from '/components/ContributeForm'
import createInstance from '/ethereum/factory'
import deploy from '/ethereum/campaign'
import web3 from '/ethereum/web3'

export default function Campaign({
  address,
  minimumContribution,
  balance,
  requestsCount,
  approversCount,
  manager
}) {
  const renderCards = () => {
    const items = [
      {
        header: manager,
        meta: 'Address of manager',
        description:
          'The manager created this campaign and can create requests to withdraw money.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: web3.utils.fromWei(minimumContribution, 'ether'),
        meta: 'Ether',
        description: 'The minimum contribution required to contribute.'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Ether',
        description: 'The amount of money contributed to this campaign.'
      },
      {
        header: requestsCount,
        meta: 'Requests',
        description: 'Number of spending requests.'
      },
      {
        header: approversCount,
        meta: 'Approvers',
        description: 'Number of people who have donated to the campaign.'
      }
    ]

    return <Card.Group items={items} />
  }

  return (
    <div>
      <h3>Campaign details</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCards()}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`}>
              <Button primary>View spending requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { address } = context.query

  const campaign = await deploy(address)

  const summary = await campaign.methods.getSummary().call()

  return {
    props: {
      address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4]
    }
  }
}
