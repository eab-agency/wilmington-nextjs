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
export default function BlockFaqListing({ faqs_listing }) {
  const faqs = []
  // TODO: add schema markup
  return (
    <>
      <pre>FILE: BlockFaqListing.js</pre>
      {faqs.map(({ question, answer }, index) => (
        <Accordian title={question} key={index}><div dangerouslySetInnerHTML={{ __html: answer }} /></Accordian>
      ))}
    </>
  )
}
