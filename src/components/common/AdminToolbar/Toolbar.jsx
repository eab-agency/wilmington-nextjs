import { useAuth } from '@faustwp/core'
import React from 'react'
import { ToolbarNodes } from './ToolbarNodes'

/**
 * Custom Admin Toolbar Component
 * Based on Faust.js toolbar but without deprecation warnings
 */
export function Toolbar({ seedNode }) {
  const { isAuthenticated } = useAuth()

  // Only show toolbar for authenticated users
  if (isAuthenticated !== true) {
    return null
  }

  return (
    <div id="wpadminbar" className="nojq nojs">
      <div
        className="quicklinks"
        id="wp-toolbar"
        role="navigation"
        aria-label="Toolbar"
      >
        <ul id="wp-admin-bar-root-default" className="ab-top-menu">
          <ToolbarNodes seedNode={seedNode} />
        </ul>
      </div>
    </div>
  )
}
