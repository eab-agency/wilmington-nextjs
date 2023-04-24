import cn from 'classnames'
import parse from 'html-react-parser'
import Link from 'next/link'
import PropTypes from 'prop-types'
import styles from './Breadcrumbs.module.scss'

/**
 * Render the Breadcrumbs component.
 *

 * @param  {object}  props             The component attributes as props.
 * @param  {Array}   props.breadcrumbs The breadcrumb array.
 * @return {Element}                   The Breadcrumbs component.
 */
export default function Breadcrumbs({ breadcrumbs }) {
  return (
    <>
      {!!breadcrumbs?.length && (
        <ul className={cn(styles.breadcrumbs, 'breadcrumbs')}>
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index}>
              <Link href={breadcrumb?.url}>
                {breadcrumb?.text ? parse(breadcrumb.text) : null}
              </Link>
              {index < breadcrumbs.length - 1 && (
                <span className={styles.sep}> &raquo; </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.array.isRequired
}
