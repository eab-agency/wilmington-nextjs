import React from 'react'
import CustomRefinementList from '../refinements/CustomRefinementList'

/**
 * Render the PostType component.
 *
 * @param  {object}  props                   The component attributes as props.
 * @param  {object}  props.refinements       The refinement properties.
 * @param  {string}  props.defaultRefinement The default refinement setting.
 * @param  {string}  props.className         The component className.
 * @return {Element}                         The PostType component.
 */
export default function PostType ({ refinements, defaultRefinement, className }) {
  const data = {
    title: 'Content Type',
    attribute: 'post_type_label',
    showMore: true,
    limit: refinements.limit,
    translations: refinements.translations,
    defaultRefinement: defaultRefinement ? [defaultRefinement] : [],
    className
  }
  return <CustomRefinementList {...data} />
}
