import newrelic from 'newrelic'
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(context: DocumentContext) {
    const initialProps = await Document.getInitialProps(context)

    if (newrelic.agent.collector.isConnected() === false) {
      await new Promise((resolve) => {
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
