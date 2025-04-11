'use client'

import cn from 'classnames'
import Image from 'next/image'
import React, { useState } from 'react'
import Modal from '../Modal/Modal'
import modalStyles from '../Modal/Modal.module.scss'
import styles from './ModalButton.module.scss'

function getEmbedUrl(url) {
  if (!url) return ''

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId
    if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]
      // Remove any additional parameters
      videoId = videoId.split('&')[0]
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]
      // Remove any additional parameters
      videoId = videoId.split('?')[0]
    }
    return `https://www.youtube.com/embed/${videoId}`
  } else if (url.includes('vimeo.com')) {
    const matches = url.match(/vimeo\.com\/(\d+)/)
    if (matches) {
      return `https://player.vimeo.com/video/${matches[1]}`
    }
  }
  return url
}

export default function ModalButton({
  label = 'Open Modal',
  url = '', // This is now the videoUrl
  imageUrl = '', // Separate imageUrl prop
  useImage = false,
  imageWidth = '100%',
  align = 'center'
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const embedUrl = getEmbedUrl(url) // Process the videoUrl
  const containerClasses = cn(styles.modalButton, `align${align}`)
  const modalId = React.useId() // Generate unique ID for each modal instance

  return (
    <>
      <div className={containerClasses}>
        {useImage && imageUrl ? (
          <button
            className={styles.imageButton}
            onClick={() => setIsModalOpen(true)}
            aria-label={label}
            data-modal-id={modalId}
          >
            <Image
              src={imageUrl}
              alt={label}
              width={800}
              height={450}
              style={{ width: imageWidth }}
            />
          </button>
        ) : (
          <button
            className={styles.defaultButton}
            onClick={() => setIsModalOpen(true)}
            data-modal-id={modalId}
          >
            {label}
          </button>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {embedUrl && (
          <div className={modalStyles.aspectRatio}>
            <iframe
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              data-modal-id={modalId}
            />
          </div>
        )}
      </Modal>
    </>
  )
}
