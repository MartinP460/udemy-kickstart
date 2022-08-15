import { Table, Button } from 'semantic-ui-react'
import web3 from '../ethereum/web3'
import getActiveCampaign from '../ethereum/campaign'

export default function RequestRow({ id, request, address, approversCount }) {
  const { Row, Cell } = Table
  const readyToFinalize = request.approvalCount > approversCount / 2

  const handleApprove = async () => {
    const campaign = await getActiveCampaign(address)
    const accounts = await web3.eth.getAccounts()
    await campaign.methods.approveRequest(id).send({
      from: accounts[0]
    })
  }

  const handleFinalize = async () => {
    const campaign = await getActiveCampaign(address)
    const accounts = await web3.eth.getAccounts()
    await campaign.methods.finalizeRequest(id).send({
      from: accounts[0]
    })
  }

  return (
    <Row
      disabled={request.complete}
      positive={readyToFinalize && !request.complete}
    >
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.approvalCount}/{approversCount}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="green" basic onClick={handleApprove}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="red" basic onClick={handleFinalize}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  )
}
