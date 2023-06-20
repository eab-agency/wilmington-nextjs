'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const ProgramTabs = ({ childPages, uri }) => {
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    const pageUri = window.location.pathname
    const newPath = pageUri.endsWith('/')
      ? pageUri
      : `${window.location.pathname}/`
    setCurrentPath(newPath)
  }, [])

  const handleLinkClick = (childPageUri) => {
    setCurrentPath(childPageUri)
  }

  const handleOverviewClick = () => {
    setCurrentPath(uri)
  }

  return (
    <ul className="childrenNav">
      <li className={currentPath === uri ? 'active' : undefined}>
        <Link href={uri} onClick={handleOverviewClick}>
          Overview
        </Link>
      </li>
      {childPages &&
        childPages.nodes.map((childPage) => {
          return (
            <li
              key={childPage.title}
              className={currentPath === childPage.uri ? 'active' : undefined}
            >
              <Link
                href={childPage.uri}
                onClick={() => handleLinkClick(childPage.uri)}
              >
                {childPage?.title}
              </Link>
            </li>
          )
        })}
    </ul>
  )
}

export default ProgramTabs
