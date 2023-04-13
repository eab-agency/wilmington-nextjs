import React from 'react'
import createMarkup from '@/functions/createMarkup'

/**
 * Render the Heading component.
 *
 * @param  {object}  props           The props object.
 * @param  {string}  props.children  The elements or text you'd like to render inside the heading.
 * @param  {string}  props.className The optional classname.
 * @param  {string}  props.id        The optional ID.
 * @param  {object}  props.style     The style attributes.
 * @param  {string}  props.tag       The tag name you'd like the heading to render as.
 * @return {Element}                 The Heading element.
 */
export default function Heading({
  children,
  className,
  id,
  style,
  tag = 'h1'
}) {
  if (typeof children === 'string') {
    return React.createElement(tag, {
      className,
      id,
      style,
      dangerouslySetInnerHTML: createMarkup(children)
    })
  } else {
    return React.createElement(
      tag,
      {
        className,
        id,
        style
      },
      children
    )
  }
}
