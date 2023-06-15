import Link from '@/components/common/Link'
import ParsedContent from '@/functions/parsedContent'
import styles from './RelatedProgramCard.module.scss'

interface RelatedProgramCardProps {
  title: string
  excerpt: string
  link: string
  department: string
}

const RelatedProgramCard = ({
  title,
  excerpt,
  link,
  department
}: RelatedProgramCardProps) => {
  return (
    <div className={styles.relatedProgramCard}>
      <h3>{title}</h3>
      {department}
      <ParsedContent content={excerpt} />
      <Link href={link} className="button">
        View Program
      </Link>
    </div>
  )
}

export default RelatedProgramCard
