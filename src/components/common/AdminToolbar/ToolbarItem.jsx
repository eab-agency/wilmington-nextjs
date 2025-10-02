import Link from 'next/link'
import React from 'react'

/**
 * Toolbar Item Component
 * Handles both internal and external links
 */
export function ToolbarItem({
  href,
  children,
  className = '',
  target,
  rel,
  ...props
}) {
  const isExternal = href?.startsWith('http') || target === '_blank'
  const itemClassName = `ab-item ${className}`.trim()

  if (isExternal) {
    return (
      <a
        href={href}
        className={itemClassName}
        target={target}
        rel={rel}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href || '#'} className={itemClassName} {...props}>
      {children}
    </Link>
  )
}
