import Script from 'next/script'

const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

const ClarityScript = () => {
  if (process.env.NODE_ENV !== 'production' || !clarityProjectId) {
    return null
  }

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">{`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityProjectId.replace(
          /[^a-zA-Z0-9]/g,
          ''
        )}");
    `}</Script>
  )
}

export default ClarityScript
