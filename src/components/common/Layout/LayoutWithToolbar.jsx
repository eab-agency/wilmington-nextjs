import { useAuth } from '@faustwp/core'
import React, { useEffect } from 'react'
import { Toolbar } from '../AdminToolbar'

/**
 * Layout wrapper that includes the custom admin toolbar
 */
export function LayoutWithToolbar({ children, seedNode }) {
  const { isAuthenticated } = useAuth()

  // Add admin-bar class to body when toolbar is shown
  useEffect(() => {
    if (isAuthenticated) {
      document.body.classList.add('admin-bar')
    } else {
      document.body.classList.remove('admin-bar')
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('admin-bar')
    }
  }, [isAuthenticated])

  return (
    <>
      <Toolbar seedNode={seedNode} />
      {children}
    </>
  )
}
