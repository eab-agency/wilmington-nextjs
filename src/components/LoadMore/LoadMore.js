import React, { useEffect, useRef } from 'react'

import styles from './LoadMore.module.scss'
/**
 * LoadMore shows a Button that can be clicked to load more results in a paginated post list.
 * @param {Props} props The props object.
 * @param {boolean} props.hasNextPage Flag to use if there are more results to load.
 * @param {string} props.endCursor The next pagination cursor string.
 * @param {boolean} props.isLoading Flag that indicates whether the pagination is loading.
 * @param {(object) => void} props.fetchMore Callback function to trigger the next pagination request.
 * @param {string} props.className An optional className to be added to the container.
 *
 * @return {React.ReactElement} The LoadMore component.
 */
export default function LoadMore({
  hasNextPage,
  endCursor,
  isLoading,
  fetchMore,
  className,
  useInfiniteScroll = false
}) {
  const loadMoreButtonRef = useRef()

  useEffect(() => {
    if (useInfiniteScroll && hasNextPage && endCursor) {
      const options = {
        root: null, // Use the viewport as the root
        rootMargin: '500px',
        threshold: 0 // Trigger when 0% of the button is visible
      }

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          fetchMore({
            variables: {
              after: endCursor
            }
          })
        }
      }, options)

      observer.observe(loadMoreButtonRef.current)

      // Clean up the observer when the component is unmounted
      return () => observer.disconnect()
    }
  }, [hasNextPage, endCursor, isLoading, fetchMore, useInfiniteScroll])

  if (hasNextPage && endCursor) {
    if (useInfiniteScroll) {
      return (
        <section className={className}>
          <span ref={loadMoreButtonRef} className={styles.button}>
            {isLoading ? 'Loading...' : ''}
          </span>
        </section>
      )
    } else {
      return (
        <section className={className}>
          <button
            disabled={isLoading}
            onClick={() => {
              fetchMore({
                variables: {
                  after: endCursor
                }
              })
            }}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </section>
      )
    }
  }

  return null
}
