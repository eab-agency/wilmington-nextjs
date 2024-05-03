import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'
// import * as styles from '../AlgoliaSearch.module.scss'

/**
 * Render the History component.
 *
 * @param  {object}   props                   The component attributes as props.
 * @param  {Function} props.buildSearchUrl    Construct Search URL and navigate user to results.
 * @param  {Function} props.clearLocalStorage Delete the localStorage for search results.
 * @param  {Array}    props.history           The history of searches.
 * @param  {Function} props.searchClick       Click Event for Search Results
 * @return {Element}                          The History component.
 */
export default function History({
  buildSearchUrl,
  clearLocalStorage,
  history,
  searchClick
}) {
  /**
   * Convert date and time to relative from now.
   *
   * @see https://day.js.org/docs/en/display/from-now
   * @see https://day.js.org/docs/en/plugin/relative-time
   * @param  {string} time The time as a timestamp.
   * @return {string}      Returns the string of relative time from now.
   */
  function convertDate(time) {
    dayjs.extend(relativeTime)
    const newTime = dayjs(time).fromNow()
    return newTime
  }

  return (
    <>
      {!!history?.length && (
        <div className='history'>
          <ul>
            {history.map((item, index) => (
              <li key={`history-${index}`}>
                <button
                  type="button"
                  data-url={buildSearchUrl(item.title)}
                  onClick={(e) => searchClick(e)}
                >
                  <span>{item.title}</span>
                  <span className='time'>{convertDate(item.time)}</span>
                </button>
              </li>
            ))}
            <li className='clear'>
              <button type="button" onClick={clearLocalStorage}>
                Clear History
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
