import React from 'react'
import {
  MdOutlineEditNote,
  MdCardGiftcard,
  MdOutlinePlace,
  MdInfoOutline,
  MdStarRate
} from 'react-icons/md'
import * as styles from './NavIcon.module.scss'

export default function NavIcon(item) {
  const itemIcon = item.icon
  const lowerCaseItemIcon = itemIcon.replace(/ /g, '-').toLowerCase()

  return (
    <i className={styles.iconContainer}>
      {lowerCaseItemIcon.includes('apply') ? (
        <MdOutlineEditNote />
      ) : lowerCaseItemIcon.includes('info') ? (
        <MdInfoOutline />
      ) : lowerCaseItemIcon.includes('visit') ? (
        <MdOutlinePlace />
      ) : lowerCaseItemIcon.includes('give') ? (
        <MdCardGiftcard />
      ) : (
        <MdStarRate />
      )}
    </i>
  )
}
