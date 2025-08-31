import React from 'react'
import { CustomToolbarNodes } from './CustomToolbarNodes'
import { ToolbarItem } from './ToolbarItem'

/**
 * Default toolbar nodes - customize these as needed
 */
export function ToolbarNodes({ seedNode }) {
  const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL

  return (
    <>
      {/* WordPress Admin Link */}
      <li id="wp-admin-bar-wp-logo" className="menupop">
        <ToolbarItem
          href={`${wordpressUrl}/wp-admin/`}
          className="ab-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="ab-icon" aria-hidden="true"></span>
          <span className="screen-reader-text">About WordPress</span>
        </ToolbarItem>
      </li>

      {/* Site Name */}
      <li id="wp-admin-bar-site-name" className="menupop">
        <ToolbarItem
          href={`${wordpressUrl}/wp-admin/`}
          className="ab-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wilmington College
        </ToolbarItem>
      </li>

      {/* Edit Link - if we're on a specific post/page */}
      {seedNode?.databaseId && (
        <li id="wp-admin-bar-edit">
          <ToolbarItem
            href={`${wordpressUrl}/wp-admin/post.php?post=${seedNode.databaseId}&action=edit`}
            className="ab-item"
            target="_blank"
            rel="noopener noreferrer"
          >
            Edit Page
          </ToolbarItem>
        </li>
      )}

      {/* New Content */}
      <li id="wp-admin-bar-new-content" className="menupop">
        <ToolbarItem
          href={`${wordpressUrl}/wp-admin/post-new.php`}
          className="ab-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="ab-icon" aria-hidden="true"></span>
          <span className="ab-label">New</span>
        </ToolbarItem>
      </li>

      {/* User Account */}
      <li id="wp-admin-bar-my-account" className="menupop with-avatar">
        <ToolbarItem
          href={`${wordpressUrl}/wp-admin/profile.php`}
          className="ab-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="display-name">Admin</span>
        </ToolbarItem>
      </li>

      {/* Custom Toolbar Nodes */}
      <CustomToolbarNodes />
    </>
  )
}
