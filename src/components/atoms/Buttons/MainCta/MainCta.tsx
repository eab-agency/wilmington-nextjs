import { CollegeHallIcon } from '@/components/atoms/ModalityIcons/icons'
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
  className?: string
}

function MainCta({ text, icon, url, className }: MainCtaProps) {
  return (
    <Link href={url} tabIndex="0" className={className}>
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
            case 'building':
              return <CollegeHallIcon />
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
