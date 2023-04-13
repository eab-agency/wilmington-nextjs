import React from 'react'

const MobileNavigation = ({children}) => {
  const isOpen = false
  return (
    <>
      <button type="button" aria-label="Options">
        {isOpen ? 'Less' : 'Menu'}
      </button>
      <div>{children}</div>
    </>
  )
}

export default MobileNavigation
