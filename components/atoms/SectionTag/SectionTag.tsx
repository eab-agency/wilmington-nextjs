import styles from './SectionTag.module.scss'

/**
 * @param {string} tagText - Text to be displayed in the tag
 * @param {string} className - Optional class name to be added to the tag
 */

interface SectionTagProps {
  text: string
  className?: string
}

export default function SectionTag({ text, className }: SectionTagProps) {
  return (
    <div className={`${styles.sectionTag} ${className ? className : ''}`}>
      {text}
    </div>
  )
}
