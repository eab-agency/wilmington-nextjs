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
            width={253}
            height={287}
            className={styles.image}
          />
        )}
        <h3>{title}</h3>
        <ParsedContent content={excerpt} />
      </Link>
    </div>
  )
}

export default ProgramCard
