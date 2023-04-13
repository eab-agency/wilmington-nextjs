import React from 'react'
import cn from 'classnames'
import RichText from '../RichText'
import * as styles from './PullQuote.module.css'

export default function PullQuote({ citation, className, id, style, value }) {
  return (
    <>
      {!!value && (
        <figure
          id={id || null}
          className={cn(styles.pullquote, className)}
          style={style}
        >
          <div className={styles.wrap}>
            <blockquote>
              <div className={styles.content}>
                <RichText tag="div">{value}</RichText>
              </div>
            </blockquote>
            {!!citation && (
              <figcaption className={styles.cite}>
                ~ <RichText tag="span">{citation}</RichText>
              </figcaption>
            )}
          </div>
        </figure>
      )}
    </>
  )
}
