import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

const PaginationStyles = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  text-align: center;
  margin-bottom: 5rem;
  a[disabled] {
    opacity: 0.5;
    pointer-events: none;
  }
`

export const Pagination = ({ ctx }) => {
  const { currentPage, totalPages, totalCount, pathPrefix, index } = ctx
  const isFirst = index === 0
  const isLast = index === totalPages - 1
  const previousPagePath =
    index === 1 ? `/${pathPrefix}` : `/${pathPrefix}/${currentPage - 1}`
  const nextPagePath = `/${pathPrefix}/${currentPage + 1}`

  return (
    <PaginationStyles>
      <nav>
        <p>
          <Link disabled={isFirst ? true : null} to={previousPagePath}>
            Newer posts
          </Link>
          You are on page {currentPage} of {totalPages} there are {totalCount}{' '}
          posts.
          <Link disabled={isLast ? true : null} to={nextPagePath}>
            Older posts
          </Link>
        </p>
      </nav>
    </PaginationStyles>
  )
}

export default Pagination
