import React from 'react'

/**
 * Toolbar Submenu Wrapper Component
 */
export function ToolbarSubmenuWrapper({ children, className = '', ...props }) {
  return (
    <div className={`ab-sub-wrapper ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}
