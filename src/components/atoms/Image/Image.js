/* eslint-disable @next/next/no-img-element */
import RichText from '@/components/atoms/RichText'
import remotePatterns from '@/config/imageConfig'
import { gql } from '@apollo/client'
import cn from 'classnames'
import Image from 'next/image'
import styles from './Image.module.css'

/**
 * Render the Display Image component.
 *
 * @param  {object}  props               The component properties.
 * @param  {string}  props.alt           The image alt attribute.
 * @param  {string}  props.anchor        The image anchor.
 * @param  {string}  props.caption       The image caption.
 * @param  {string}  props.className     The image class name.
 * @param  {string}  props.href          A link wrapping the image.
 * @param  {number}  props.id            The image id.
 * @param  {object}  props.imageMeta     The image meta.
 * @param  {string}  props.linkClass     The image link class name.
 * @param  {string}  props.linkTarget    The image link target.
 * @param  {boolean} props.nextImageFill Whether next/image should be set to fill or have height/width defined.
 * @param  {string}  props.rel           The relationship of the linked URL.
 * @param  {string}  props.url           The image src attribute.
 * @return {Element}                     The DisplayImage component.
 */
export default function DisplayImage(props) {
  // Set the image src.
  const source = props?.imageMeta?.mediaItemUrl ?? props?.url ?? props?.src
  const blurUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkiHCvBwACHwEgR4z1GgAAAABJRU5ErkJggg=='

  // No image src? Bail.
  if (!source) {
    return null
  }

  // Set the image size.
  const imageSize = {
    height: props?.height ?? props?.imageMeta?.mediaDetails?.height,
    width: props?.width ?? props?.imageMeta?.mediaDetails?.width
  }

  // if imageSize.height is a string, remove 'px' and convert to number
  if (typeof imageSize.height === 'string') {
    imageSize.height = Number(imageSize.height.replace('px', ''))
  }

  // if imageSize.width is a string, remove 'px' and convert to number
  if (typeof imageSize.width === 'string') {
    imageSize.width = Number(imageSize.width.replace('px', ''))
  }


  // Get the src domain from URL and remove the subdomain.
  const sourceDomain = new URL(source).hostname.split('.').slice(-2).join('.')

  // Get all domains registered in next.config.js.
  let domains = remotePatterns.map((pattern) =>
    pattern.hostname.replace('**.', '')
  )

  /**
   * Next.js <Image /> component.
   *
   * @see https://nextjs.org/docs/basic-features/image-optimization
   * @return {Element} The next/image component.
   */
  function NextImage() {
    const imageProps = {
      alt: props?.alt ?? 'No alt text provided.',
      id: props?.anchor,
      src: source,
      priority: props?.priority,
      placeholder: blurUrl ? 'blur' : 'empty',
      blurDataURL: blurUrl
    }

    // Add extra props depending on whether image needs to be set to "fill".
    if (props?.nextImageFill) {
      imageProps.fill = true
    } else {
      imageProps.height = imageSize?.height
      imageProps.width = imageSize?.width
    }

    return (
      // eslint-disable-next-line
      <Image
        {...imageProps}
        className={cn(props?.nextImageFill ? styles.imageFill : null)}
      />
    )
  }

  /**
   * HTML image component.
   *
   * @return {Element} A plain ol' HTML <img> tag.
   */
  function HtmlImage() {
    return (
      <img
        alt={props?.alt}
        className={cn(styles.image, props?.className)}
        height={imageSize?.height}
        id={props?.anchor}
        src={props?.url}
        width={imageSize?.width}
      />
    )
  }

  /**
   * Image Link component.
   *
   * @param  {object}  props          The component propterties.
   * @param  {Array}   props.children Any children.
   * @return {Element}                The ImageLink component.
   */
  function ImageLink({ children }) {
    return (
      <a
        className={props?.linkClass}
        href={props?.href}
        rel={props?.rel}
        target={props?.linkTarget}
      >
        {children}
      </a>
    )
  }

  /**
   * Image caption component.
   *
   * @return {Element} An image caption.
   */
  function Caption() {
    return (
      <div className={styles.caption}>
        <RichText tag="span">{props?.caption}</RichText>
      </div>
    )
  }

  /**
   * If src domain includes allowed domains, use <Image /> component.
   *
   * @see https://nextjs.org/docs/basic-features/image-optimization#configuration
   */

  if (domains.includes(sourceDomain)) {
    return (
      <figure
        id={props?.anchor}
        className={cn(
          styles.image,
          props?.className,
          props?.id ? `image-${props?.id}` : '',
          props?.nextImageFill ? styles.hasImageFill : null
        )}
      >
        {props?.href ? (
          <ImageLink>
            <NextImage />
          </ImageLink>
        ) : (
          <NextImage />
        )}
        {!!props?.caption && <Caption />}
      </figure>
    )
  }

  /**
   * Otherwise, just use HTML <img />.
   */
  return (
    <>
      {props?.href ? (
        <ImageLink>
          <HtmlImage />
        </ImageLink>
      ) : (
        <HtmlImage />
      )}
      {!!props?.caption && <Caption />}
    </>
  )
}

DisplayImage.query = gql`
  query GET_MEDIA($id: ID!) {
    mediaItem(id: $id, idType: DATABASE_ID) {
      altText
      mediaItemUrl
      mediaDetails {
        height
        width
        sizes {
          height
          name
          sourceUrl
          width
        }
      }
    }
  }
`
