import getBlockStyles from '@/functions/wordpress/blocks/getBlockStyles'
import * as styles from './Columns.module.scss'

const Column = (props) => {
  const attributes = props.attributes
  const columnStyle = getBlockStyles({
    style: props.attributes?.style,
    width: props.attributes?.width,
    backgroundColor: props.attributes?.backgroundColor
  })
  return (
    <div
      id={attributes?.anchor || null}
      className={`${styles.column} ${attributes?.className || ''} ${
        attributes?.backgroundColor || ''
      }`}
      style={columnStyle}
    >
      {props?.children}
    </div>
  )
}

export default Column
