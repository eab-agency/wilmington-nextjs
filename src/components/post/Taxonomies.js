import React from 'react'
import {TaxonomyItem} from './TaxonomyItem'

export const Taxonomies = ({post, taxName, singularName, ...props}) => {
  const taxonomies = post[taxName]?.nodes

  return (
    taxonomies && (
      <div className="flex flex-wrap" {...props}>
        <h3>
          {taxonomies.length > 1 ? `${taxName} : ` : `${singularName} : `}
        </h3>

        {taxonomies.map((cat) => (
          <TaxonomyItem
            key={cat.slug}
            taxName={taxName}
            item={cat}
            className="mx-1 mb-3 btn btn-secondary dark:btn-primary"
          />
        ))}
      </div>
    )
  )
}
