import { NextPageContext } from 'next'
import React from 'react'

const ErrorPage = ({
  statusCode,
  error
}: {
  statusCode: number
  error?: Error
}) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{statusCode}</h1>
      <p>Something went wrong. Our team has been notified.</p>
      <code>{String(error?.cause)}</code>
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  if (typeof window == 'undefined') {
    const newrelic = require('newrelic')
    newrelic.noticeError(err)
  } else {
    // @ts-ignore
    window.newrelic.noticeError(err)
  }
  const statusCode = res?.statusCode || err?.statusCode || 500
  return { statusCode, error: err }
}

export default ErrorPage
