import { useAuth } from '@faustwp/core'
import React from 'react'
import { ToolbarNodes } from './ToolbarNodes'

/**
 * Custom Admin Toolbar Component
 * Based on Faust.js toolbar but without deprecation warnings
 */
export function Toolbar({ seedNode }) {
  const { isAuthenticated } = useAuth()

  // Only show toolbar for authenticated users (matches original FaustWP behavior)
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
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <ul
          id="wp-admin-bar-root-default"
          className="ab-top-menu"
          style={{ display: 'flex', margin: 0, padding: 0 }}
        >
          <ToolbarNodes seedNode={seedNode} position="primary" />
        </ul>
        <ul
          id="wp-admin-bar-top-secondary"
          className="ab-top-secondary ab-top-menu"
          style={{ display: 'flex', margin: 0, padding: 0 }}
        >
          <ToolbarNodes seedNode={seedNode} position="secondary" />
        </ul>
      </div>
    </div>
  )
}
