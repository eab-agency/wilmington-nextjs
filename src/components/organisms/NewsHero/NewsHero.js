import Image from '@/components/atoms/Image/Image'
import RichText from '@/components/atoms/RichText/RichText'

/**
 * @param {string} tagText - Text to be displayed in the tag
 * @param {string} className - Optional class name to be added to the tag
 * @param {string} sourceUrl - Optional image source URL
 * @param {string} altText - Optional image alt text
 * @param {object} mediaDetails - Optional image meta data
 */

export default function NewsHero({ text, sourceUrl, altText, mediaDetails }) {
  return (
    <>
      <header className={sourceUrl ? 'hero-w-image' : 'no-img-hero'}>
        <div className="page-hero">
          <Image
            url={sourceUrl}
            alt={altText}
            imageMeta={{ mediaDetails }}
            width="900"
            height="300"
          />
        </div>

        <div className="page-head">
          <RichText tag="h1">{text}</RichText>
        </div>
      </header>
    </>
  )
}
