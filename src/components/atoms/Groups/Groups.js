'use client'

import cn from 'classnames'
import PropTypes from 'prop-types'
import { useState } from 'react'
import Button from '../Buttons/Button/Button'
import * as styles from './Groups.module.scss'

/**
 * Render the Group component.
 *
 * @param  {object}  props                   Container component props.
 * @param  {string}  props.id                Optional ID/Anchor.
 * @param  {string}  props.className         Optional className.
 * @param  {string}  props.groupsCount       Total number of Group.
 * @param  {object}  props.children          React children.
 * @param  {object}  props.style             Custom Group styles.
 * @param  {string}  props.verticalAlignment Vertical alignment of Group.
 * @param  {boolean} props.isStackedOnMobile Checks if the Group are stacked.
 * @return {Element}                         The Group component.
 */

export default function Groups({
  id,
  className,
  groupsCount = 3,
  children,
  tagName,
  verticalAlignment,
  isStackedOnMobile,
  bgColor
}) {
  const [drawerState, setDrawerState] = useState('closed')
  const [drawerBtn, setDrawerBtn] = useState('Read More')
  const Tag = tagName || 'div'

  const toggleDrawer = () => {
    if (drawerState === 'closed') {
      setDrawerState('open')
      setDrawerBtn('Close')
    } else {
      setDrawerState('closed')
      setDrawerBtn('Read More')
    }
  }

  const getTagClassNames = () => {
    const baseClassNames = [
      styles.groups,
      isStackedOnMobile && styles.groupsStacked,
      groupsCount && styles[`columns-${groupsCount}`],
      className,
      verticalAlignment === 'center' ? styles.alignCenter : null,
      verticalAlignment === 'bottom' ? styles.alignBottom : null,
      id === 'content-drawer' && styles.drawerContainer,
      bgColor && bgColor,
      drawerState === 'open' && id === 'content-drawer' && 'drawerOpen'
    ]

    return cn(baseClassNames)
  }

  return (
    <Tag id={id || null} className={getTagClassNames()}>
      {id === 'content-drawer' && (
        <>
          <div className="drawer">{children}</div>
          <div className="drawerBtnContainer">
            <Button
              className="drawerButton"
              onClick={toggleDrawer}
              text={drawerBtn}
            />
          </div>
        </>
      )}
      {id !== 'content-drawer' && children}
    </Tag>
  )
}

Groups.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  groupsCount: PropTypes.number,
  children: PropTypes.node,
  verticalAlignment: PropTypes.string
}
