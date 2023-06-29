'use client'

import { useState } from 'react'
import { MdAdd, MdRemove } from 'react-icons/md'

const QuickFact = ({ fact }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => setIsOpen(!isOpen)

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

  return (
    <div className="quickFactAccordion">
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
}

export default QuickFact
