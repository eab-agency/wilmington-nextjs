import React from 'react'
import ReactHtmlParser from 'react-html-parser' // Import the library
import { Highlight } from 'react-instantsearch-dom'
import searchClick from '../functions/searchClick'

/**
 * Render the Hit component.
 *
 * @see https://www.algolia.com/doc/api-reference/widgets/hits/react/
 * @param  {object}  props     The component attributes as props.
 * @param  {object}  props.hit Renders each hit from the results.
 * @return {Element}           The Hit component.
 */
export default function Hit({ hit }) {
  const sanitizedTitle = ReactHtmlParser(hit.post_title)
  // strip off "https://www.wilmington.edu" from the beginning of the permalink
  const permalink = hit.permalink.replace(/^https:\/\/www.wilmington.edu/, '')

  return (
    <button
      type="button"
      data-url={hit?.permalink}
      data-title={hit?.post_title}
      onClick={(e) => searchClick(e)}
    >
      <Highlight
        attribute="post_title"
        hit={{
          ...hit,
          _highlightResult: {
            ...hit._highlightResult,
            post_title: {
              value: sanitizedTitle.join(''),
              matchLevel: 'full'
            }
          }
        }}
      />
      <span> {permalink}</span>
    </button>
  )
}
