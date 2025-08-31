import React from 'react'
import { ToolbarItem, ToolbarSubmenu, ToolbarSubmenuWrapper } from './index'

/**
 * Custom toolbar nodes for your specific needs
 * Add your custom toolbar items here
 */
export function CustomToolbarNodes() {
  return (
    <>
      {/* Custom Node Example */}
      <li id="wp-admin-bar-custom-node">
        <ToolbarItem
          href="https://wpengine.com"
          target="_blank"
          rel="nofollow"
          className="ab-item"
        >
          Custom Node
        </ToolbarItem>
      </li>

      {/* Custom Node with Submenu Example */}
      <li id="wp-admin-bar-custom-submenu" className="menupop">
        <ToolbarItem href="#" className="ab-item">
          Custom Menu
        </ToolbarItem>
        <ToolbarSubmenuWrapper>
          <ToolbarSubmenu>
            <li>
              <ToolbarItem
                href="https://wpengine.com"
                target="_blank"
                rel="nofollow"
                className="ab-item"
              >
                Link 1
              </ToolbarItem>
            </li>
            <li>
              <ToolbarItem
                href="https://wpengine.com"
                target="_blank"
                rel="nofollow"
                className="ab-item"
              >
                Link 2
              </ToolbarItem>
            </li>
            <li>
              <ToolbarItem
                href="https://wpengine.com"
                target="_blank"
                rel="nofollow"
                className="ab-item"
              >
                Link 3
              </ToolbarItem>
            </li>
          </ToolbarSubmenu>
        </ToolbarSubmenuWrapper>
      </li>
    </>
  )
}
