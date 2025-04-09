import React from 'react'
import { useCurrentRefinements } from 'react-instantsearch';

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
          className="clearBtn"
        >
          Clear All Filters
        </button>
      )}
    </>
  )
}

const CustomClearRefinements = connectCurrentRefinements(ClearRefinements)
export default CustomClearRefinements

// TODO (Codemod generated): ensure your usage correctly maps the props from the connector to the hook
function connectCurrentRefinements(Component) {
  const CurrentRefinements = (props) => {
    const data = useCurrentRefinements(props);

    return <Component {...props} {...data} />;
  };

  return CurrentRefinements;
}
