import QuickFact from '@/components/atoms/QuickFact'
import Link from '@/components/common/Link'
import ParsedContent from '@/functions/parsedContent'
// import styles from './ResultProgramCard.module.scss'

type ResultProgramCardProps = {
  title: string
  excerpt: string
  link: string
  quickFact?: string
}

const ResultProgramCard = ({
  title,
  excerpt,
  link,
  quickFact
}: ResultProgramCardProps) => {
  return (
    <div className="resultProgramCard">
      <div className="programContent">
        <h3>{title}</h3>
        {excerpt && <ParsedContent content={excerpt} />}
      </div>
      {/* {quickFact && <QuickFact fact={quickFact} />} */}
      <Link href={link} className="button">
        View Program
      </Link>
    </div>
  )
}

export default ResultProgramCard
