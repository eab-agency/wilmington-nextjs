import React from 'react'
import Accordian from '@/components/molecules/Accordian'
/**
 * FAQ Listing Block
 *
 * The core Home Testimonial block from Gutenberg.
 *
 * @param  {object}  props                      The component properties.
 * @return {Element}                            The Faq component.
 */
// eslint-disable-next-line camelcase
export default function BlockFaqListing({faqData}) {
  return (
    <>
      <pre>FILE: BlockFaqListing.js</pre>
      {faqData.map(({title, content, id}) => (
        <Accordian title={title} key={id}>
          <div dangerouslySetInnerHTML={{__html: content}} />
        </Accordian>
      ))}
    </>
  )
}
