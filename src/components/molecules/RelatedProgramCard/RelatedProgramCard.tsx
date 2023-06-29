import QuickFact from '@/components/atoms/QuickFact'
import Link from '@/components/common/Link'
import ParsedContent from '@/functions/parsedContent'
import styles from './RelatedProgramCard.module.scss'

type RelatedProgramCardProps = {
  title: string
  excerpt: string
  link: string
  department?: string
  quickFact?: string
}

const RelatedProgramCard = ({
  title,
  excerpt,
  link,
  quickFact
}: RelatedProgramCardProps) => {
  return (
    <div className={styles.relatedProgramCard}>
      <h3>{title}</h3>
      {excerpt && <ParsedContent content={excerpt} />}
      {quickFact && <QuickFact fact={quickFact} />}
      <Link href={link} className="button">
        View Program
      </Link>
    </div>
  )
}

export default RelatedProgramCard
