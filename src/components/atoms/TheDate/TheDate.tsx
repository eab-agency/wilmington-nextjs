import styles from './theDate.module.scss'

const TheDate = (prop: { date: number }): any => {
  const theDate = new Date(prop.date)
  const formattedDate = theDate.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })
  return <time className={styles.theTime}>{formattedDate}</time>
}

export default TheDate
