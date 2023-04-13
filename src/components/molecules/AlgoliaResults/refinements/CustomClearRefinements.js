import React from 'react'
import { connectCurrentRefinements } from 'react-instantsearch-dom'
import * as styles from '../AlgoliaResults.module.scss'

/**
 * Render the ClearRefinements component.
 *
 * @see https://www.algolia.com/doc/api-reference/widgets/clear-refinements/react/
 * @param  {object}   props        The component attributes as props.
 * @param  {any}      props.items  Any refinement.
 * @param  {Function} props.refine Modifies the items being displayed.
 * @return {Element}               The ClearRefinements component.
 */
function ClearRefinements({ items, refine }) {
  return (
    <>
      {!!items?.length && (
        <button
          type="button"
          onClick={() => refine(items)}
          disabled={!items.length}
          className={styles.clearBtn}
        >
          Clear All Filters
        </button>
      )}
    </>
  )
}

const CustomClearRefinements = connectCurrentRefinements(ClearRefinements)
export default CustomClearRefinements
