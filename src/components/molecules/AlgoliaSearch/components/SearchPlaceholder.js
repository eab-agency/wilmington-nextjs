import { MdOutlineSearch } from 'react-icons/md'
import * as styles from '../AlgoliaSearch.module.scss'

/**
 * Render the SearchPlaceholder component.
 *
 * Note: the `Search` component is loaded using Dynamic Imports.
 *
 * @param  {object}   props               The component attributes as props.
 * @param  {Function} props.toggleAlgolia Toggle the Search component.
 * @param  {string}   props.query         The search query.
 * @return {Element}                      The SearchPlaceholder component.
 */
// export default function SearchPlaceholder({ toggleAlgolia, query }) {
export default function SearchPlaceholder({ toggleAlgolia }) {
  return (
    <div className={styles.searchPlaceholder}>
      <div className={styles.searchBox}>
        <button
          role="button"
          tabIndex={0}
          type="button"
          className={styles.trigger}
          onClick={() => {
            toggleAlgolia(true)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              toggleAlgolia(true)
            }
          }}
        >
          <span>
            <MdOutlineSearch />
          </span>
        </button>
      </div>
    </div>
  )
}
