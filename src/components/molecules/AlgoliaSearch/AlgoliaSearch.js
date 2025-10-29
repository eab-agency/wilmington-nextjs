'use client'

import { useWordPressContext } from '@/components/common/WordPressProvider'
import parseQuerystring from '@/functions/parseQuerystring'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
// import * as styles from './AlgoliaSearch.module.scss'
import Search from './components/Search'
import SearchPlaceholder from './components/SearchPlaceholder'

/**
 * Render the AlgoliaSearch component.
 *
 * @param  {object}  props                The component attributes as props.
 * @param  {string}  props.className      The component class.
 * @param  {boolean} props.useHistory     Whether to display the history.
 * @param  {boolean} props.usePlaceholder Whether to display the placeholder.
 * @return {Element}                      The AlgoliaSearch component.
 */
function AlgoliaSearch({ useHistory, usePlaceholder, className }) {
  const path = ''
  const query = path.includes('q=') ? parseQuerystring(path, 'q') : '' // Parse the querystring.
  const [loadAlgolia, setLoadAlgolia] = useState(false)
  const searchRef = useRef()
  const searchContentRef = useRef(null)

  // Provide a fallback empty object if the context is undefined
  const { algolia } = useWordPressContext() || {}

  /**
   * Add a class to the body when the Algolia search is open.
   * This is to avoid DOM scrolling and trap focus.
   */
  useEffect(() => {
    if (loadAlgolia) {
      document.body.classList.add('searchOpen')
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden'
      // Store the currently focused element to restore later
      const previouslyFocusedElement = document.activeElement

      return () => {
        document.body.classList.remove('searchOpen')
        document.body.style.overflow = ''
        // Restore focus when modal closes
        if (previouslyFocusedElement && previouslyFocusedElement.focus) {
          previouslyFocusedElement.focus()
        }
      }
    } else {
      document.body.classList.remove('searchOpen')
      document.body.style.overflow = ''
    }
  }, [loadAlgolia])

  // /**
  //  * Set a min-height value on the search wrapper
  //  * to avoid DOM movement during dynamic render.
  //  *
  //  * @return {object} A minimum height value.
  //  */
  // function setMinHeight() {
  //   const minHeight =
  //     searchRef?.current && usePlaceholder
  //       ? searchRef.current.offsetHeight
  //       : '0'
  //   return { minHeight: `${minHeight}px` }
  // }

  /**
   * Toggle the state of the Algolia `Search`
   * and `SearchPlaceholder` components.
   *
   * @param {boolean} value Show/hide Algolia search input.
   */
  function toggleAlgolia(value) {
    setLoadAlgolia(value)
  }

  return (
    <div>
      {!!algolia?.indexName && (
        <div className={`${className} algoliaSearch`} ref={searchRef}>
          <SearchPlaceholder query={query} toggleAlgolia={toggleAlgolia} />
          {!!loadAlgolia || !usePlaceholder ? (
            <>
              <div className="searchContainer">
                <div
                  className="searchBackdrop"
                  onClick={() => {
                    toggleAlgolia(false)
                  }}
                  aria-label="Close the search window"
                />
                <div className="searchContent" ref={searchContentRef}>
                  <button
                    type="button"
                    className="closeSearch"
                    onClick={() => {
                      toggleAlgolia(false)
                    }}
                    aria-label="Close search"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="24"
                      height="24"
                    >
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                  <Search
                    indexName={algolia?.indexName}
                    useHistory={useHistory}
                    query={query}
                    onCloseModal={() => toggleAlgolia(false)}
                    searchContentRef={searchContentRef}
                  />
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  )
}

AlgoliaSearch.displayName = 'AlgoliaSearch'

export default AlgoliaSearch
