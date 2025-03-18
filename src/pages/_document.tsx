import newrelic from 'newrelic'
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'

interface NewRelicProps {
  browserTimingHeader: string
}

export default class MyDocument extends Document<NewRelicProps> {
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
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?&family=Roboto+Slab&display=swap"
            rel="stylesheet"
          />

          <script
            type="text/javascript"
            // The body of the script element comes from the async evaluation
            // of `getInitialProps`. We use the special
            // `dangerouslySetInnerHTML` to provide that element body. Since
            // it requires an object with an `__html` property, we pass in an
            // object literal.
            dangerouslySetInnerHTML={{
              __html: (this.props as any).browserTimingHeader
            }}
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
