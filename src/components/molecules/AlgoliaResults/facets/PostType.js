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
export default function PostType({
  refinements,
  defaultRefinement,
  className
}) {
  const data = {
    title: 'Filter Results',
    attribute: 'post_type_label',
    showMore: true,
    limit: refinements.limit,
    translations: refinements.translations,
    transformItems: refinements.transformItems,
    defaultRefinement: defaultRefinement ? [defaultRefinement] : [],
    className
  }
  return <CustomRefinementList {...data} />
}
