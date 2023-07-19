/* eslint-disable no-unused-vars */
import cn from 'classnames'
import PropTypes from 'prop-types'
import * as styles from './Code.module.css'

/**
 * Render the Code component.
 *
 */
export default function Code({ id, className, content, style }) {
  const classNames = className?.length ? className.split(' ') : []

  if (!content) return null

  return (
    <div
      id={id || null}
      className={cn(styles.code, classNames.join(' '))}
      style={style}
    >
      {content}
    </div>
  )
}

Code.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
}
