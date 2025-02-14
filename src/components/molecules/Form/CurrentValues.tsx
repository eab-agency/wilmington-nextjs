import { useFormikContext } from 'formik'
import React from 'react'

const CurrentValues: React.FC = () => {
  const { values, errors, touched, dirty } =
    useFormikContext<Record<string, any>>()

  return (
    <div className="current-values">
      <h3>Current Form Values</h3>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <h3>Errors</h3>
      <pre>{JSON.stringify(errors, null, 2)}</pre>
      <h3>Touched</h3>
      <pre>{JSON.stringify(touched, null, 2)}</pre>
      <h3>Dirty</h3>
      <pre>{JSON.stringify(dirty, null, 2)}</pre>
    </div>
  )
}

export default CurrentValues
