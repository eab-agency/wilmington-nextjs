import cn from 'classnames'
import React from 'react'
import * as styles from './Separator.module.css'

export default function Separator({ anchor, className, fullWidth }) {
  return (
    <hr
      id={anchor}
      className={cn(
        styles.separator,
        !fullWidth && styles.containerWidth,
        className
      )}
    />
  )
}
