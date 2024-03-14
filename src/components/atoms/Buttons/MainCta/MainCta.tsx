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

function MainCta({ text, icon, url }: MainCtaProps) {
  return (
    <Link href={url} tabIndex="0">
      <figure>
        {(() => {
          switch (icon) {
            case 'location':
              return <MdOutlinePlace />
            case 'edit_note':
              return <MdOutlineEditNote />
            case 'redeem':
              return <MdCardGiftcard />
            case 'info':
              return <MdInfoOutline />
            case 'phone':
              return <MdLocalPhone />
            default:
              return <MdStar />
          }
        })()}
      </figure>
      {text}
    </Link>
  )
}

export default MainCta
