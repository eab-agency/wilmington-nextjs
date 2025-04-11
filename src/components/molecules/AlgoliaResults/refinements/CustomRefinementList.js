import cn from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useRefinementList } from 'react-instantsearch'

function RefinementList({
  attribute,
  className,
  items,
  limit,
  refine,
  showCount = false,
  showMore,
  title,
  translations
}) {
  const [extended, setExtended] = useState(false)

  return (
    <>
      {!!items && items.length > 0 && (
        <section className={`filterPanel ${className}`}>
          {title && <h3>{title}</h3>}
          <ul className="refinementList">
            {items.map(
              (item, index) =>
                (index < limit || extended) && (
                  <li key={`${item.label}-${index}-${item.isRefined}`}>
                    <input
                      type="checkbox"
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

RefinementList.propTypes = {
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

const CustomRefinementList = connectRefinementList(RefinementList)
export default CustomRefinementList

// TODO (Codemod generated): ensure your usage correctly maps the props from the connector to the hook
function connectRefinementList(Component) {
  const RefinementList = (props) => {
    const data = useRefinementList(props)

    return <Component {...props} {...data} />
  }

  return RefinementList
}
