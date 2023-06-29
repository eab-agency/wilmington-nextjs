import Link from '@/components/common/Link'

export const TaxonomyItem = ({ taxName, item, ...props }) => (
  <Link
    className="block mb-3"
    href={item.uri}
    aria-label={`visit ${taxName} ${item.name} page`}
    {...props}
  >
    {item.name}
  </Link>
)
