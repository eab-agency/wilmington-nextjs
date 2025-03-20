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
      id="nr-browser-agent"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  )
}
