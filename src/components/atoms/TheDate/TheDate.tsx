import styles from './theDate.module.scss'

const formatDate = (dateString: string): string => {
  let formattedDate
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC', // Ensuring our formatted date respects the timezone already passed in the date string
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }

  // Check if the date string has the "T" separator
  if (dateString.includes('T')) {
    const date = new Date(dateString)
    formattedDate = date.toLocaleDateString('en-US', options)
  } else {
    const [year, month, day] = dateString.split('-')
    const formattedMonth = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10)
    ).toLocaleDateString('en-US', options)
    formattedDate = formattedMonth
  }

  return formattedDate
}

const TheDate = ({ date }: { date: string }): any => {
  const formattedDate = formatDate(date)
  return <time className={styles.theTime}>{formattedDate}</time>
}

export default TheDate
