import { useState } from 'react'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import getActiveCampaign from '../ethereum/campaign'
import web3 from '../ethereum/web3'

export default function ContributeForm({ address }) {
  const [value, setValue] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const onSubmit = async (event) => {
    event.preventDefault()

    setErrorMessage('')
    setLoading(true)

    try {
      const campaign = await getActiveCampaign(address)
      const accounts = await web3.eth.getAccounts()

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether')
      })
      router.reload()
    } catch (err) {
      setErrorMessage(err.message)
    }

    setLoading(false)
  }

  return (
    <Form onSubmit={onSubmit} error={Boolean(errorMessage)}>
      <Form.Field widths="equal">
        <label>Amount to Contribute</label>
        <Input
          type="number"
          label="Ether"
          labelPosition="right"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </Form.Field>
      <Button primary disabled={loading} loading={loading}>
        Contribute
      </Button>
      <Message error header="Oops!" content={errorMessage} />
    </Form>
  )
}
