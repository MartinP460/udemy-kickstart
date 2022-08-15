import { useState } from 'react'
import { Form, Button, Message, Input } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import getActiveCampaign from '/ethereum/campaign'
import web3 from '/ethereum/web3'

export default function NewRequest({ address }) {
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [recipient, setRecipient] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrorMessage('')
    setLoading(true)

    const campaign = await getActiveCampaign(address)

    try {
      const accounts = await web3.eth.getAccounts()
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({
          from: accounts[0]
        })
      setDescription('')
      setValue('')
      setRecipient('')
    } catch (err) {
      setErrorMessage(err.message)
    }
    setLoading(false)
  }

  return (
    <Form onSubmit={handleSubmit} error={Boolean(errorMessage)}>
      <Link href={`/campaigns/${address}/requests`}>
        <Button>Back</Button>
      </Link>
      <h3>Create a request</h3>
      <Form.Field>
        <label>Description</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Value in Ether</label>
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Recipient</label>
        <Input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </Form.Field>
      <Button primary loading={loading} disabled={loading}>
        Create request
      </Button>
      <Message error header="Oops!" content={errorMessage} />
    </Form>
  )
}

export async function getServerSideProps(context) {
  const { address } = context.query

  return {
    props: {
      address
    }
  }
}
