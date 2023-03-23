import React from 'react'
import CustomRefinementList from '../refinements/CustomRefinementList'

/**
 * Render the Authors component.
 *
 * @param  {object}  props                   The component attributes as props.
 * @param  {object}  props.refinements       The refinement properties.
 * @param  {string}  props.defaultRefinement The default refinement setting.
 * @param  {string}  props.className         The component className.
 * @return {Element}                         The Authors component.
 */
export default function Authors ({ refinements, defaultRefinement, className }) {
  const data = {
    title: 'Authors',
    attribute: 'post_author.display_name',
    showMore: true,
    limit: refinements.limit,
    translations: refinements.translations,
    defaultRefinement: defaultRefinement ? [defaultRefinement] : [],
    className
  }
  return <CustomRefinementList {...data} />
}
