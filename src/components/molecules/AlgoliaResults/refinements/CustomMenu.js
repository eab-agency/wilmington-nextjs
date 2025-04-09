import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useMenu } from 'react-instantsearch';

/**
 * Render the Menu component.
 *
 * @see https://www.algolia.com/doc/api-reference/widgets/menu/react/
 * @param  {object}   props              The component attributes as props.
 * @param  {string}   props.attribute    The name of the attribute in the record.
 * @param  {string}   props.className    The component class.
 * @param  {any}      props.items        Any refinement.
 * @param  {number}   props.limit        The number of facet values to retrieve.
 * @param  {Function} props.refine       Modifies the items being displayed.
 * @param  {boolean}  props.showCount    Whether to display the count.
 * @param  {boolean}  props.showMore     Whether to display a button that expands the number of items.
 * @param  {string}   props.title        The component title.
 * @param  {object}   props.translations A mapping of keys to translation values.
 * @return {Element}                     The Menu component.
 */
function Menu({
  attribute,
  className,
  items,
  limit,
  refine,
  showCount = true,
  showMore,
  title,
  translations
}) {
  const [extended, setExtended] = useState(false)

  return (
    <>
      {!!items && items.length > 0 && (
        <section className={`filterPanel  ${className}`}>
          {title && <h3>{title}</h3>}
          <ul>
            {items.map(
              (item, index) =>
                (index < limit || extended) && (
                  <li key={`${item.label}-${index}`}>
                    <input
                      type="radio"
                      id={`chk-${item.label}`}
                      name={attribute}
                      value={item.value}
                      onChange={() => refine(item.value)}
                      checked={item.isRefined}
                    />
                    <label htmlFor={`chk-${item.label}`}>
                      {item.label} {showCount && <span>[{item.count}]</span>}
                    </label>
                  </li>
                )
            )}
          </ul>
          {showMore && limit < items.length && (
            <button
              type="button"
              onClick={() => {
                setExtended(!extended)
              }}
              className="moreBtn"
            >
              {translations.showMore(extended)}
            </button>
          )}
        </section>
      )}
    </>
  )
}

Menu.propTypes = {
  attribute: PropTypes.string,
  className: PropTypes.string,
  items: PropTypes.any.isRequired,
  limit: PropTypes.number,
  refine: PropTypes.func,
  showCount: PropTypes.bool,
  showMore: PropTypes.bool,
  title: PropTypes.string,
  translations: PropTypes.object
}

const CustomMenu = connectMenu(Menu)
export default CustomMenu

// TODO (Codemod generated): ensure your usage correctly maps the props from the connector to the hook
function connectMenu(Component) {
  const Menu = (props) => {
    const data = useMenu(props);

    return <Component {...props} {...data} />;
  };

  return Menu;
}
