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

  // Provide a fallback empty object if the context is undefined
  const { algolia } = useWordPressContext() || {}

  /**
   * Add a class to the body when the Algolia search is open.
   * This is to avoid DOM scrolling.
   */
  useEffect(() => {
    if (loadAlgolia) {
      document.body.classList.add('searchOpen')
    } else {
      document.body.classList.remove('searchOpen')
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
                <button
                  type="button"
                  className="closeSearch"
                  onClick={() => {
                    toggleAlgolia(false)
                  }}
                >
                  Click to close the search window
                </button>
                <Search
                  indexName={algolia?.indexName}
                  useHistory={useHistory}
                  query={query}
                  onCloseModal={() => toggleAlgolia(false)}
                />
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
