import newrelic from 'newrelic'
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'

type NewRelicProps = {
  browserTimingHeader: string
}

class MyDocument extends Document<NewRelicProps> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps & NewRelicProps> {
    const initialProps = await Document.getInitialProps(ctx)

    /**
     * For SSG pages the build is faster than the agent connect cycle
     * In those cases, let's wait for the agent to connect before getting
     * the browser agent script.
     */
    // @ts-ignore
    if (!newrelic.agent.collector.isConnected()) {
      await new Promise((resolve) => {
        // @ts-ignore
        newrelic.agent.on('connected', resolve)
      })
    }

    const browserTimingHeader = newrelic.getBrowserTimingHeader({
      hasToRemoveScriptWrapper: true,
      allowTransactionlessInjection: true
    })

    return {
      ...initialProps,
      browserTimingHeader
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?&family=Roboto+Slab&display=swap"
            rel="stylesheet"
          />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{ __html: this.props.browserTimingHeader }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
