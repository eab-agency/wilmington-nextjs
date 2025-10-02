import { gql, useQuery } from '@apollo/client'
import { getApolloAuthClient, useAuth } from '@faustwp/core'
import md5 from 'md5'
import { useRouter } from 'next/router'
import { ToolbarItem } from './ToolbarItem'
import { ToolbarSubmenuWrapper } from './ToolbarSubmenuWrapper'

/**
 * Default toolbar nodes - customize these as needed
 */
export function ToolbarNodes({ seedNode, position = 'primary' }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const client = getApolloAuthClient()

  // Query WordPress for user data
  const { data: userData } = useQuery(
    gql`
      {
        viewer {
          name
          email
          username
        }
      }
    `,
    { client, skip: !isAuthenticated }
  )

  const user = userData?.viewer

  // Remove trailing slash to prevent double slashes in URLs
  const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, '')

  // Determine if we're in preview mode
  const isPreview =
    router.pathname === '/preview' || router.query.preview === 'true'

  // Get the page ID - only show edit link when NOT in preview mode
  // In preview mode, the edit link is already in the WordPress admin
  const pageId = !isPreview ? seedNode?.databaseId : null

  // Get user avatar URL from email using Gravatar
  const getGravatarUrl = (email, size = 26) => {
    if (!email) return `https://secure.gravatar.com/avatar/?s=${size}&d=mm&r=g`

    const hash = md5(email.toLowerCase().trim())
    return `https://secure.gravatar.com/avatar/${hash}?s=${size}&d=mm&r=g`
  }

  const avatarUrl = user?.email ? getGravatarUrl(user.email) : getGravatarUrl()
  const avatarUrl2x = user?.email
    ? getGravatarUrl(user.email, 52)
    : getGravatarUrl(null, 52)
  const userName = user?.name || 'Admin'
  const userNicename = user?.username || user?.email?.split('@')[0] || 'admin'

  // Primary menu (left side)
  if (position === 'primary') {
    return (
      <>
        {/* WordPress Admin Link */}
        <li id="wp-admin-bar-wp-logo" className="menupop">
          <ToolbarItem href={`${wordpressUrl}/wp-admin/`} className="ab-item">
            <span className="ab-icon" aria-hidden="true"></span>
            <span className="screen-reader-text">About WordPress</span>
          </ToolbarItem>
        </li>

        {/* Site Name */}
        <li id="wp-admin-bar-site-name" className="menupop">
          <ToolbarItem href={`${wordpressUrl}/wp-admin/`} className="ab-item">
            Wilmington College
          </ToolbarItem>
        </li>

        {/* Edit Link - if we're on a specific post/page */}
        {pageId && (
          <li id="wp-admin-bar-edit">
            <ToolbarItem
              href={`${wordpressUrl}/wp-admin/post.php?post=${pageId}&action=edit`}
              className="ab-item"
            >
              Edit
            </ToolbarItem>
          </li>
        )}

        {/* New Content */}
        <li id="wp-admin-bar-new-content" className="menupop">
          <ToolbarItem
            href={`${wordpressUrl}/wp-admin/post-new.php?post_type=page`}
            className="ab-item"
          >
            <span className="ab-icon" aria-hidden="true"></span>
            <span className="ab-label">New Page</span>
          </ToolbarItem>
        </li>
      </>
    )
  }

  // Secondary menu (right side)
  return (
    <>
      {/* User Account */}
      <li id="wp-admin-bar-my-account" className="menupop with-avatar">
        <a role="menuitem" className="ab-item" aria-haspopup="true">
          Howdy, <span className="display-name">{userName}</span>
          <img
            alt=""
            className="avatar avatar-26 photo"
            height="26"
            width="26"
            loading="lazy"
            decoding="async"
            srcSet={`${avatarUrl2x} 2x`}
            src={avatarUrl}
          />
        </a>
        <ToolbarSubmenuWrapper>
          <ul className="ab-submenu" id="wp-admin-bar-user-actions">
            <li id="wp-admin-bar-user-info">
              <ToolbarItem
                href={`${wordpressUrl}/wp-admin/profile.php`}
                className="ab-item"
              >
                <img
                  alt=""
                  className="avatar avatar-64 photo"
                  height="64"
                  width="64"
                  loading="lazy"
                  decoding="async"
                  srcSet={`${getGravatarUrl(user?.email, 128)} 2x`}
                  src={getGravatarUrl(user?.email, 64)}
                />
                <span className="display-name">{userName}</span>
                <span className="username">{userNicename}</span>
              </ToolbarItem>
            </li>
            <li id="wp-admin-bar-edit-profile">
              <ToolbarItem
                href={`${wordpressUrl}/wp-admin/profile.php`}
                className="ab-item"
              >
                Edit Profile
              </ToolbarItem>
            </li>
            <li id="wp-admin-bar-logout">
              <ToolbarItem
                href={`${wordpressUrl}/wp-login.php?action=logout`}
                className="ab-item"
              >
                Log Out
              </ToolbarItem>
            </li>
          </ul>
        </ToolbarSubmenuWrapper>
      </li>
    </>
  )
}
