import React from "react"

const TheDate = (prop: { date: number }): any => {
  const theDate = new Date(prop.date)
  const formattedDate = theDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  })
  return <time>{formattedDate}</time>
}

export default TheDate
