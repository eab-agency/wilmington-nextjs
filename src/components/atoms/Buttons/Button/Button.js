import Icon from '@/components/atoms/Icon'
import Link from '@/components/common/Link'
import cn from 'classnames'
import React from 'react'
import { MdChevronRight } from 'react-icons/md'
import styles from './Button.module.scss'

/**
 * Render the common inner part of the button component.
 *
 * @param  {object}  props          The props object.
 * @param  {string}  props.icon     Optional icon.
 * @param  {boolean} props.iconOnly Whether this button is an icon only.
 * @param  {string}  props.text     Button text or aria-label.
 * @return {Element}                The inside of the Button component.
 */

export function ButtonInner({ icon, iconOnly, text }) {
  return (
    <>
      {!iconOnly && (
        <span
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
      {icon ? (
        <Icon icon={icon} title={text} ariaHidden={!!text} />
      ) : (
        <i>
          <MdChevronRight />
        </i>
      )}
    </>
  )
}

/**
 * @param  {object}   props              The props object.
 * @param  {string}   props.attributes   Optional attributes to add to the button.
 * @param  {string}   props.className    Optional classNames.
 * @param  {boolean}  props.disabled     Whether the button is disabled.
 * @param  {boolean}  props.fluid        Whether the button should be full width.
 * @param  {string}   props.icon         Icon to render inside the button.
 * @param  {boolean}  props.iconOnly     Whether this button should render as an icon only button.
 * @param  {string}   props.iconLeft     Whether to render the icon on the left.
 * @param  {Function} props.onClick      Button onClick function.
 * @param  {string}   props.size         Button size.
 * @param  {object}   props.style        Custom button styles.
 * @param  {boolean}  props.styleOutline Whether this button has the outline style.
 * @param  {string}   props.tag          The wrapper tag.
 * @param  {string}   props.text         Button text.
 * @param  {string}   props.type         Button type.
 * @param  {string}   props.url          Button link url.
 * @return {Element}                     The button component.
 */

export default function Button({
  attributes,
  className,
  disabled,
  fluid,
  icon,
  iconOnly,
  iconLeft,
  onClick,
  size,
  style,
  styleOutline,
  tag = 'button',
  text,
  type,
  url
}) {
  const buttonClassNames = cn(
    styles.button,
    className,
    iconOnly && styles.iconOnly,
    iconLeft && styles.iconLeft,
    fluid && styles.fluid,
    disabled && styles.disabled,
    styles[size],
    styles[type],
    styleOutline && styles.styleOutline
  )

  if (url) {
    return (
      <Link
        href={url}
        className={buttonClassNames}
        aria-label={text}
        style={style}
        tabIndex={disabled ? -1 : 0}
        {...attributes}
      >
        <ButtonInner icon={icon} iconOnly={iconOnly} text={text} />
      </Link>
    )
  } else {
    return (
      // Render element with default button tag.
      React.createElement(
        `${tag}`,
        {
          className: buttonClassNames,
          'aria-label': text,
          onClick,
          ...attributes,
          disabled,
          style,
          tabIndex: disabled ? -1 : 0
        },
        <ButtonInner icon={icon} iconOnly={iconOnly} text={text} />
      )
    )
  }
}
