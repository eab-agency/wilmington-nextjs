import Link from '@/components/common/Link'
import React from 'react'
import {
  MdOutlineEditNote,
  MdCardGiftcard,
  MdOutlinePlace,
  MdInfoOutline,
  MdLocalPhone
} from 'react-icons/md'

interface MainCtaProps {
  text: string
  icon: string
  url: string
}

function MainCta({ text, icon, url }: MainCtaProps) {
  return (
    <Link href={url}>
      {icon === 'location_on' && (
        <figure>
          <MdOutlinePlace />
        </figure>
      )}
      {icon === 'edit_note' && (
        <figure>
          <MdOutlineEditNote />
        </figure>
      )}
      {icon === 'redeem_outlined' && (
        <figure>
          <MdCardGiftcard />
        </figure>
      )}
      {icon === 'info_outlined' && (
        <figure>
          <MdInfoOutline />
        </figure>
      )}
      {icon === 'phone_enabled' && (
        <figure>
          <MdLocalPhone />
        </figure>
      )}

      {text}
    </Link>
  )
}

export default MainCta
