import React from 'react'
import { ErrorMessage } from 'formik'
import * as styles from './InputError.module.css'

/**
 * Render the InputError component.
 *
 * @param  {object}        props      The component attributes as props.
 * @param  {string|number} props.name Input id.
 * @return {Element}                  The InputError component.
 */
export default function InputError({ name }) {
  return (
    <span className={styles.inputError}>
      <ErrorMessage name={name} />
    </span>
  )
}
