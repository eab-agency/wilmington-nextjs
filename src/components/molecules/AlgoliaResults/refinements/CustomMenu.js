import cn from 'classnames'
import { useMenu } from 'react-instantsearch'

function Menu({ classNames = {}, hideCount = false, ...props }) {
  const { items, refine } = useMenu(props)
  const { value: selectedValue } = items.find((item) => item.isRefined) || {
    value: ''
  }

  return (
    <div className={cn('ais-CustomMenu', classNames.root)}>
      <select
        className={cn('ais-CustomMenu-select', classNames.select)}
        value={selectedValue}
        onChange={(event) => {
          refine(event.target.value)
        }}
      >
        <option
          value=""
          className={cn(
            'ais-CustomMenu-option-all',
            classNames.option,
            classNames.optionFirst
          )}
        >
          All
        </option>
        {items.map((item) => (
          <option
            key={item.value}
            value={item.value}
            className={cn('ais-CustomMenu-option', classNames.option)}
          >
            {item.label}
            {!hideCount && item.item.count}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Menu
