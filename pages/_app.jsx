import Header from '../components/Header'
import { Container } from 'semantic-ui-react'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>
      <Container>
        <Header />
        <Component {...pageProps} />
      </Container>
    </>
  )
}
