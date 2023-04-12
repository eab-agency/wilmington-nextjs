'use client'

import React, { useState } from "react"
import Button from "@/components/atoms/Buttons/Button"
import Heading from "@/components/atoms/Heading"

function StudentOrg({ heading, url, quickFact }) {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => setIsOpen(!isOpen)

  const ShowHideButton = () => (
    <button aria-expanded={isOpen} onClick={handleOpen}>
      <span>{isOpen ? "- Hide" : "+ Show"} </span>Quick Facts
    </button>
  )

  const QuickFact = ({ fact }) => (
    <>
      <ShowHideButton />
      <div
        id="accordion-content"
        aria-labelledby="accordion-button"
        hidden={!isOpen}
        role="region"
        dangerouslySetInnerHTML={{ __html: fact }}
      />
    </>
  )
  return (
    <>
      <pre>FILE: StudentOrg.txs</pre>
      <Heading tag="h3">{heading}</Heading>
      <Button url={url} text="Visit Org" />
      {quickFact && <QuickFact fact={quickFact} />}
    </>
  )
}

export default StudentOrg
