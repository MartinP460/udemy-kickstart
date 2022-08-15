import { Button, Table } from 'semantic-ui-react'
import Link from 'next/link'
import getActiveCampaign from '/ethereum/campaign'
import RequestRow from '/components/RequestRow'

export default function Request({
  address,
  requests,
  requestCount,
  approversCount
}) {
  const { Header, Row, HeaderCell, Body } = Table

  const renderRows = () => {
    return requests
      .map((request, index) => (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={address}
          approversCount={approversCount}
        />
      ))
      .reverse()
  }

  return (
    <>
      <h3>Request list</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <Button primary floated="right" style={{ marginBottom: '10px' }}>
          Add request
        </Button>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requestCount} requests.</div>
    </>
  )
}

export async function getServerSideProps(context) {
  const { address } = context.query

  const campaign = await getActiveCampaign(address)

  const requestCount = await campaign.methods.getRequestsCount().call()
  const approversCount = await campaign.methods.approversCount().call()

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call()
      })
  )

  const finalRequests = JSON.parse(JSON.stringify(requests))

  return {
    props: {
      address,
      requests: finalRequests,
      requestCount,
      approversCount
    }
  }
}
