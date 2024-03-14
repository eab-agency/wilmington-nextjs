import Link from '@/components/common/Link'
import React from 'react'
import {
  MdCardGiftcard,
  MdInfoOutline,
  MdLocalPhone,
  MdOutlineEditNote,
  MdOutlinePlace,
  MdStar
} from 'react-icons/md'

interface MainCtaProps {
  text: string
  icon: string
  url: string
}

function MainCta({ text, icon = 'edit_note', url }: MainCtaProps) {
  return (
    <Link href={url} tabindex="0">
      {icon === 'location' && (
        <figure>
          <MdOutlinePlace />
        </figure>
      )}
      {icon === 'edit_note' && (
        <figure>
          <MdOutlineEditNote />
        </figure>
      )}
      {icon === 'redeem' && (
        <figure>
          <MdCardGiftcard />
        </figure>
      )}
      {icon === 'info' && (
        <figure>
          <MdInfoOutline />
        </figure>
      )}
      {icon === 'phone' && (
        <figure>
          <MdLocalPhone />
        </figure>
      )}
      {icon === null && (
        <figure>
          <MdStar />
        </figure>
      )}
      {text}
    </Link>
  )
}

export default MainCta
