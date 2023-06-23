'use client'

import Button from '@/components/atoms/Buttons/Button'
import Heading from '@/components/atoms/Heading'
import React, { useState } from 'react'
import { MdAdd, MdRemove } from 'react-icons/md'

function StudentOrg({ heading, url, quickFact }) {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => setIsOpen(!isOpen)

  // add icon to button

  const ShowHideButton = () => (
    <button
      type="button"
      className="quickFactsBtn"
      aria-expanded={isOpen}
      onClick={handleOpen}
    >
      {isOpen ? 'Hide quick facts' : 'Show quick facts'}{' '}
      <i>{isOpen ? <MdRemove /> : <MdAdd />} </i>
    </button>
  )

  const QuickFact = ({ fact }) => (
    <div className="studentOrgAccordion">
      <div
        id="accordion-content"
        aria-labelledby="accordion-button"
        hidden={!isOpen}
        role="region"
        dangerouslySetInnerHTML={{ __html: fact }}
      />
      <ShowHideButton />
    </div>
  )
  return (
    <article className="studentOrg">
      <div className="studentOrgContent">
        <Heading tag="h3">{heading}</Heading>
        {quickFact && <QuickFact fact={quickFact} />}
      </div>
      <Button url={url} text="Visit Org" />
    </article>
  )
}

export default StudentOrg
