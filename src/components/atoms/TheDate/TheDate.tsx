import React from "react"
import * as styles from "./theDate.module.scss"

const TheDate = (prop: { date: number }): any => {
  const theDate = new Date(prop.date)
  const formattedDate = theDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  })
  return <time className={styles.time}>{formattedDate}</time>
}

export default TheDate
