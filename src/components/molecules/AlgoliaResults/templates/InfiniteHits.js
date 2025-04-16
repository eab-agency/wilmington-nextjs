import cn from 'classnames'
import React, { useEffect, useRef } from 'react'
import { useInfiniteHits } from 'react-instantsearch'

export function InfiniteHits({
  hitComponent: HitComponent,
  classNames = {},
  ...props
}) {
  const { items, isLastPage, showMore } = useInfiniteHits(props)
  const sentinelRef = useRef(null)

  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore()
          }
        })
      })

      observer.observe(sentinelRef.current)

      return () => {
        observer.disconnect()
      }
    }
  }, [isLastPage, showMore])

  return (
    <div className={cn('ais-InfiniteHits', classNames.root)}>
      <ul className={cn('ais-InfiniteHits-list', classNames.list)}>
        {items.map((hit) => (
          <li
            key={hit.objectID}
            className={cn('ais-InfiniteHits-item', classNames.item)}
          >
            <HitComponent hit={hit} />
          </li>
        ))}
        <li
          className="ais-InfiniteHits-sentinel"
          ref={sentinelRef}
          aria-hidden="true"
        />
      </ul>
    </div>
  )
}
