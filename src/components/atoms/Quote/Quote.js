import RichText from '@/components/atoms/RichText'
import Link from '@/components/common/Link'
import cn from 'classnames'
import React from 'react'
import styles from './Quote.module.scss'

export default function Quote({
  citation,
  id,
  className,
  style,
  children,
  link
}) {
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
            <Link href={link}>
              {typeof citation === 'object' ? (
                citation
              ) : (
                <RichText tag="span">{citation}</RichText>
              )}
            </Link>
          </div>
        </figcaption>
      )}
    </>
  )
}
