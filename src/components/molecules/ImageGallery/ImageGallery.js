import React from 'react'
import RichText from '@/components/atoms/RichText'
import cn from 'classnames'
import PropTypes from 'prop-types'
import * as styles from './ImageGallery.module.css'
import Block from '@/components/molecules/Blocks'

/**
 * Render the ImageGallery component.
 *
 * @param  {object}  props           The component properties.
 * @param  {string}  props.anchor    The anchor/id of the block.
 * @param  {string}  props.caption   The image caption.
 * @param  {string}  props.className The image class.
 * @param  {number}  props.columns   The amount of columns.
 * @param  {Array}   props.images    The array of images.
 * @return {Element}                 The ImageGallery component.
 */
export default function ImageGallery({
  anchor,
  caption,
  columns = 3,
  className,
  images,
  innerBlocks,
  children
}) {
  return (
    <>
      {!!innerBlocks?.length && (
        <div id={anchor || null} className={cn(styles.gallery, className)}>
          <div className={cn(styles.wrap, styles[`columns-${columns}`])}>
            {innerBlocks.map((block, index) => {
              return (
                <div key={index} className={styles.imageWrap}>
                  <Block block={block} key={index} index={index} />
                </div>
              )
            })}
          </div>
          {!!caption && (
            <div className={styles.caption}>
              <RichText tag="span">{caption}</RichText>
            </div>
          )}
        </div>
      )}
    </>
  )
}

ImageGallery.propTypes = {
  anchor: PropTypes.string,
  caption: PropTypes.string,
  columns: PropTypes.number,
  className: PropTypes.string,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      alt: PropTypes.string,
      caption: PropTypes.string,
      fullUrl: PropTypes.string,
      id: PropTypes.string,
      link: PropTypes.string,
      url: PropTypes.string
    })
  )
}
