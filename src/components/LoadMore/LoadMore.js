import Preloader from '@/components/atoms/Preloader'
import { className } from 'classnames/bind'
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
 * @param {boolean} props.useInfiniteScroll Whether to use infinite scroll instead of button.
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
  const loadMoreRef = useRef()

  useEffect(() => {
    if (!useInfiniteScroll || !hasNextPage) return

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isLoading) {
        if (typeof fetchMore === 'function') {
          // Handle GraphQL pagination
          if (endCursor) {
            fetchMore({
              variables: {
                after: endCursor
              }
            })
          }
          // Handle Algolia pagination
          else {
            fetchMore()
          }
        }
      }
    }, options)

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, endCursor, isLoading, fetchMore, useInfiniteScroll])

  if (!hasNextPage) {
    return null
  }

  if (useInfiniteScroll) {
    return (
      <div className={`${className} ${styles.loadMoreContainer}`}>
        <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
          {isLoading && <Preloader />}
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} ${styles.loadMoreContainer}`}>
      <button
        className={styles.button}
        disabled={isLoading}
        onClick={() => {
          if (typeof fetchMore === 'function') {
            // Handle GraphQL pagination
            if (endCursor) {
              fetchMore({
                variables: {
                  after: endCursor
                }
              })
            }
            // Handle Algolia pagination
            else {
              fetchMore()
            }
          }
        }}
      >
        {isLoading ? <Preloader /> : 'Load More'}
      </button>
    </div>
  )
}
