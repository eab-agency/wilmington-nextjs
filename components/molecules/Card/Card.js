/* eslint-disable no-unused-vars */
import Button from '@/components/atoms/Buttons/Button'
import Heading from '@/components/atoms/Heading'
import RichText from '@/components/atoms/RichText'
import Link from '@/components/common/Link'
import cn from 'classnames'
import Image from 'next/image'
import React from 'react'
import * as styles from './Card.module.css'

// /**
//  * Render the Card component.
//  *
//  * @param  {object}  props              Card component props.
//  * @param  {string}  props.body         Card body text.
//  * @param  {string}  props.buttonText   The text for the cta button.
//  * @param  {string}  props.className    Optional classNames.
//  * @param  {string}  props.headingLevel The heading tag.
//  * @param  {object}  props.image        The image object.
//  * @param  {string}  props.meta         The card metadata string.
//  * @param  {string}  props.timestamp    The card timestamp.
//  * @param  {string}  props.title        The card title.
//  * @param  {string}  props.url          The url.
//  * @return {Element}                    The Card component.
//  */
const Card = ({
  body,
  buttonText,
  className,
  headingLevel,
  image,
  meta,
  timestamp,
  title,
  url
}) => {
  return (
    <div className={cn(styles.card, className)}>
      {image && (
        <Image
          image={image.gatsbyImage}
          alt={image.altText || ''}
          loading="eager"
        />
      )}
      <div className={styles.content}>
        {meta && <p className={styles.meta}>{meta}</p>}
        {title &&
          (url ? (
            <Link href={url}>{title}</Link>
          ) : (
            <Heading className={styles.title}>{title}</Heading>
          ))}
        {body && <RichText className={styles.body}>{body}</RichText>}
      </div>
      <div className={styles.footer}>
        {timestamp && (
          <p className={styles.timestamp}>
            <time>{timestamp}</time>
          </p>
        )}
        {buttonText && url && (
          <Button
            className={styles.button}
            url={url}
            text={buttonText}
            type="secondary"
            size="md"
          />
        )}
      </div>
    </div>
  )
}

export default Card
