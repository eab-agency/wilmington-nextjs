'use client'
import Link from '@/components/common/Link'
import { gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const ProgramTabs = ({ childPages, uri, parent }) => {
  const router = useRouter()

  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    const newPath = router.asPath.endsWith('/')
      ? router.asPath
      : `${router.asPath}/`
    setCurrentPath(newPath)
  }, [router.asPath])

  const handleLinkClick = (childPageUri) => {
    setCurrentPath(childPageUri)
  }

  const handleOverviewClick = () => {
    setCurrentPath(uri)
  }

  const nodes = parent?.node?.children?.nodes ?? childPages?.nodes

  return (
    <ul className="childrenNav">
      <li
        className={
          currentPath === parent?.node?.uri || (!parent && currentPath === uri)
            ? 'active'
            : undefined
        }
      >
        <Link href={parent?.node?.uri ?? uri} onClick={handleOverviewClick}>
          Overview
        </Link>
      </li>
      {nodes &&
        nodes
          .filter((childPage) => childPage.menuOrder !== null) // Exclude null values
          .sort((a, b) => {
            if (a.menuOrder === b.menuOrder) {
              // Secondary sorting based on ID if menuOrder is the same
              return a.id - b.id
            } else {
              return a.menuOrder - b.menuOrder
            }
          })
          // Sort in ascending order
          .concat(nodes.filter((childPage) => childPage.menuOrder === null)) // Add back null values at the end
          .map((childPage) => (
            <li
              key={childPage.uri}
              className={currentPath === childPage.uri ? 'active' : undefined}
            >
              <Link
                href={childPage.uri}
                onClick={() => handleLinkClick(childPage.uri)}
              >
                {childPage?.title}
              </Link>
            </li>
          ))}
    </ul>
  )
}

export default ProgramTabs

const CHILDFRAGMENT = `
    children {
      nodes {
        uri
        slug
        ... on Program {
          id
          title
          uri
          menuOrder
        }
      }
    }
`

export const ProgramTabsFragment = gql`
  fragment ProgramTabsFragment on Program {
    uri
    parent {
      node {
        uri
        slug
        ... on Program {
          id
          title
          uri
          menuOrder
             ${CHILDFRAGMENT}
        }
      }
    }
    ${CHILDFRAGMENT}
  }
`
