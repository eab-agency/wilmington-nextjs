/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import {
  DEV_SCRIPT,
  PRODUCTION_SCRIPT,
  STAGING_SCRIPT
} from '@/components/NewRelic/new-relic-scripts-per-env'
import { IS_PRODUCTION, IS_STAGING } from '@/lib/environment'
import Script from 'next/script'

export default function NewRelicScript() {
  const scriptContent = IS_PRODUCTION
    ? PRODUCTION_SCRIPT
    : IS_STAGING
    ? STAGING_SCRIPT
    : DEV_SCRIPT

  return (
    <Script
      // We have to set an id for inline scripts.
      // See https://nextjs.org/docs/app/building-your-application/optimizing/scripts#inline-scripts
      id="nr-browser-agent"
      // By setting the strategy to "beforeInteractive" we guarantee that
      // the script will be added to the document's `head` element.
      strategy="beforeInteractive"
    >
      {scriptContent}
    </Script>
  )
}
