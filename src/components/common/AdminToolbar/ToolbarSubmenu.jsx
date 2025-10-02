import React from 'react'

/**
 * Toolbar Submenu Component
 */
export function ToolbarSubmenu({ children, className = '', ...props }) {
  return (
    <div className={`ab-sub-wrapper ${className}`.trim()} {...props}>
      <ul id="wp-admin-bar-submenu" className="ab-submenu">
        {children}
      </ul>
    </div>
  )
}
