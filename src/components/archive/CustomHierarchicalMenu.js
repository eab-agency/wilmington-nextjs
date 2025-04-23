import React, { useEffect, useRef, useState } from 'react'
import { useHierarchicalMenu } from 'react-instantsearch'

export default function CustomHierarchicalMenu({
  attributes,
  limit = 10,
  showMore = true,
  showMoreLimit = 100
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const {
    items,
    refine,
    canRefine,
    isShowingMore,
    canToggleShowMore,
    toggleShowMore
  } = useHierarchicalMenu({
    attributes,
    limit,
    showMore,
    showMoreLimit
  })

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    // Handle escape key
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  // Find the currently selected item and its parent
  const findSelectedItem = (items, parent = null) => {
    for (const item of items) {
      if (item.isRefined) {
        return { item, parent }
      }
      if (item.data) {
        const result = findSelectedItem(item.data, item)
        if (result) return result
      }
    }
    return null
  }

  const selectedResult = findSelectedItem(items)
  // If a child item is selected, it will be the selected item, and its parent will be in selectedParent
  const selectedItem = selectedResult?.item
  const selectedParent = selectedResult?.parent

  // Find if the selected item is a child (has a parent) or is itself a parent (has data)
  const isSelectedItemChild = selectedItem && selectedParent
  const isSelectedItemParent = selectedItem?.data?.length > 0

  const renderItems = (items) => {
    return (
      <ul>
        {items.map((item) => {
          const isChildSelected = item.data?.some((child) => child.isRefined)
          return (
            <li
              key={item.label}
              className={`${item.isRefined ? 'selected' : ''} ${
                item.data?.length > 0 ? '--parent' : ''
              } ${isChildSelected ? '--parent-selected' : ''}`}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  refine(item.value)
                  setIsOpen(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    refine(item.value)
                    setIsOpen(false)
                  }
                }}
                role="button"
                tabIndex={isChildSelected ? -1 : 0}
              >
                {item.label}
              </a>
              {item.data && item.data.length > 0 && renderItems(item.data)}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div
      className={`EABHierarchicalMenu ${isOpen ? 'isOpen' : ''}`}
      ref={menuRef}
    >
      <button
        className="dropdownToggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {selectedItem
          ? isSelectedItemChild
            ? selectedItem.label
            : isSelectedItemParent &&
              selectedItem.data.some((child) => child.isRefined)
            ? selectedItem.data.find((child) => child.isRefined).label
            : selectedItem.label
          : 'Select a Department'}
      </button>

      <div className={`dropdownContent ${isOpen ? 'show' : ''}`}>
        {canRefine && (
          <ul>
            <li className={!selectedItem ? 'selected' : ''}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  refine('')
                  setIsOpen(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    refine('')
                    setIsOpen(false)
                  }
                }}
                role="button"
                tabIndex={0}
              >
                All Departments
              </a>
            </li>
            {renderItems(items)}
          </ul>
        )}

        {canToggleShowMore && (
          <button
            className="showMoreButton"
            onClick={toggleShowMore}
            type="button"
          >
            {isShowingMore ? '- Show Less' : '+ Show More ...'}
          </button>
        )}
      </div>
    </div>
  )
}
