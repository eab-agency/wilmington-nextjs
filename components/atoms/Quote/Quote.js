import React from 'react'
import RichText from '@/components/atoms/RichText'
import cn from 'classnames'
import * as styles from './Quote.module.scss'

export default function Quote ({ citation, id, className, style, children }) {
  return (
    <>
      {!!children && (
        <figcaption
          id={id || null}
          className={cn(styles.quote, className)}
          style={style}
        >
          <blockquote>
            <div className={styles.content}>{children}</div>
          </blockquote>
          {/* if citation prop is a react component, just render the component, else RichText the content.
          TODO: probably a better way to handle this */}
            <div className={styles.cite}>
          {typeof citation === 'object'
            ? (
                citation
              )
            : (
                          <RichText tag="span">{citation}</RichText>
              )}
            </div>
        </figcaption>
      )}
    </>
  )
}
