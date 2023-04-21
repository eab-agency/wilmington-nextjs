import Image from '@/components/atoms/Image'
import Link from '@/components/common/Link'
import ParsedContent from '@/functions/parsedContent'
import styles from './ProgramCard.module.scss'

const ProgramCard = ({ title, excerpt, link, image }) => {
  return (
    <div className={styles.programCard}>
      <Link href={link}>
        {image && (
          <Image
            url={image.sourceUrl}
            alt={image.altText}
            imageMeta={{ mediaDetails: image.mediaDetails }}
            className={styles.image}
          />
        )}
        <h3>{title}</h3>
        <ParsedContent content={excerpt} />
        {/* {link && <Link href={link}>View Program</Link>}
         */}
      </Link>
    </div>
  )
}

export default ProgramCard
