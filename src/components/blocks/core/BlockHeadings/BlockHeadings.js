import Heading from '@/components/atoms/Heading'
import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles'
import cn from 'classnames'

export default function BlockHeadings({
  anchor,
  className,
  content,
  fontSize,
  textColor,
  level,
  style,
  textAlign
}) {
  const headingStyle = getBlockStyles({ style, fontSize, textColor })

  const classes = {
    [className]: true,
    'text-center': textAlign === 'center',
    'text-left': !textAlign || textAlign === 'left',
    'text-right': textAlign === 'right',
    [fontSize]: !!fontSize,
    [textColor]: !!textColor
  }

  return (
    <Heading
      className={cn(classes)}
      id={anchor}
      style={headingStyle}
      tag={`h${level}`}
    >
      {content}
    </Heading>
  )
}
