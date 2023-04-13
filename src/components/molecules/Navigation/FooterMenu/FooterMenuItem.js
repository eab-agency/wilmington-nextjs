import Link from '@/components/common/Link'

const FooterMenuItem = ({ item }) => {
  return (
    <li className="menu-items">
      <Link href={item.path ?? '#'}>{item.label}</Link>
    </li>
  )
}

export default FooterMenuItem
