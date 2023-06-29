import Link from 'next/link'
import React from 'react'

export const TaxonomyItem = ({ taxName, item, ...props }) => (
  <Link
    className="block mb-3"
    href={`${item.uri}`}
    aria-label={`visit ${taxName} ${item.name} page`}
    {...props}
  >
    {item.name}
  </Link>
)
