import Image from 'next/image';
import React from 'react';
import ReactHtmlParser from 'react-html-parser'; // Import the library
import { Highlight } from 'react-instantsearch-dom';
import searchClick from '../functions/searchClick';

import { MdArticle, MdAutoStories, MdCampaign, MdEvent, MdFindInPage, MdOutlineContactPage, MdSchool } from 'react-icons/md';



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
  const strippedPermalink = hit.permalink.replace(/^https:\/\/www.wilmington.edu/, '')

  const {
    post_title,
    post_type,
    permalink
  } = hit


  const PostIcon = () => {
    if (post_type === 'program') {
      return <figure><MdSchool /></figure>
    }
    if (post_type === 'page') {
      return <figure><MdArticle /></figure>
    }
    if (post_type === 'news') {
      return <figure><MdCampaign />
      </figure>
    }
    if (post_type === 'event') {
      return <figure><MdEvent /></figure>
    }
    if (post_type === 'faculty') {
      return <figure><MdOutlineContactPage /></figure>
    }

    return <figure><MdFindInPage /></figure>
  }

  return (
    <button
      type="button"
      data-url={permalink}
      data-title={post_title}
      onClick={(e) => searchClick(e)}
    >
      <PostIcon />
      <div className='hitResultContent'>
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
        <small className='resultLink'> {strippedPermalink}</small>
      </div>
    </button>
  )
}
