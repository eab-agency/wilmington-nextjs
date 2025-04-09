import React from 'react'
import { connectRefinementList } from 'react-instantsearch-dom'

function Department({ items, refine, refinements, className }) {
  return (
    <div className={className}>
      {items && items.length > 0 && (
        <div className="departmentFilter">
          <h3>Filter by Department</h3>
          <ul>
            {items.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <input
                  type="checkbox"
                  id={`chk-${item.label}`}
                  name="faculty_departments"
                  value={item.value}
                  onChange={() => refine(item.value)}
                  checked={item.isRefined}
                />
                <label htmlFor={`chk-${item.label}`}>
                  {item.label} <span>[{item.count}]</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default connectRefinementList(Department)
