import { useState } from 'react'
import { useRouter } from 'next/router'
import { Form, Input, Button, Message } from 'semantic-ui-react'
import createInstance from '../../ethereum/factory'
import web3 from '../../ethereum/web3'

export default function NewCampaign() {
  const [minimumContribution, setMinimumContribution] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSumbit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setErrorMessage('')

    try {
      const accounts = await web3.eth.getAccounts()
      const factory = await createInstance()
      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0]
      })
      router.push('/')
    } catch (err) {
      setErrorMessage(err.message)
    }
    setLoading(false)
  }

  return (
    <>
      <h3>Create a campaign</h3>
      <Form onSubmit={handleSumbit} error={Boolean(errorMessage)}>
        <Form.Field>
          <label>Minimum contribution</label>
          <Input
            type="number"
            label="Wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={(e) => setMinimumContribution(e.target.value)}
          ></Input>
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button primary disabled={loading} loading={loading}>
          Create
        </Button>
      </Form>
    </>
  )
}
