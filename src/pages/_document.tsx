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

class RootDocument extends Document<NewRelicProps> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps & NewRelicProps> {
    const initialProps = await Document.getInitialProps(ctx)

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

export default RootDocument
