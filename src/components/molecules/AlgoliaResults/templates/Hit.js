import Link from '@/components/common/Link';
import { Highlight } from 'react-instantsearch-dom';
import * as styles from '../AlgoliaResults.module.scss';

/**
 * Render the Hit component.
 *
 * @param  {object}  props     The component attributes as props.
 * @param  {object}  props.hit The hit data.
 * @return {Element}           The Hit component.
 */
export default function Hit({ hit }) {
  return (
    <div className={styles.hit}>

      <Link href={hit.permalink}><h3
        dangerouslySetInnerHTML={{
          __html: hit._highlightResult.post_title.value
        }}
      /></Link>
      <div className={styles.date} dangerouslySetInnerHTML={{ __html: hit._snippetResult.content.value }} />
    </div >
  )
}
