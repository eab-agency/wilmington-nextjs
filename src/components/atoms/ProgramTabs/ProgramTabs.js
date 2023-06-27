'use client'
import { gql } from '@apollo/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const childPageSampleData = [
  {
    title: 'Concentrations',
    uri: '/programs/agriculture/concentrations/'
  },
  {
    title: 'Admissions',
    uri: '/programs/agriculture/admissions/'
  }
]

const parentPageSampleData = {
  id: '1234',
  slug: 'agriculture',
  uri: '/programs/agriculture/',
  title: 'Agriculture',
  node: {
    children: {
      nodes: childPageSampleData
    }
  }
}

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
        nodes.map((childPage) => (
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
             ${CHILDFRAGMENT}
        }
      }
    }
    ${CHILDFRAGMENT}
  }
`
