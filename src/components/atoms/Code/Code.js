import cn from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {tomorrow} from 'react-syntax-highlighter/dist/cjs/styles/prism'
import * as styles from './Code.module.css'

/**
 * Render the Code component.
 *
 */
export default function Code({id, className, content, style}) {
  const classNames = className?.length ? className.split(' ') : []

  // Use the first entry in className to pass the langauge.
  const language = classNames?.length ? classNames.shift() : 'javascript'

  /**
   * Replace any `&lt;` and `&gt; encoded HTML.
   *
   * @param  {string} content The content string.
   * @return {string}         The formatted content string.
   */
  function codeFormatter(content) {
    if (!content) {
      return null
    }

    const code = content.replace(/&lt;/g, '<')
    return code.replace(/&gt;/g, '>')
  }

  const prismProps = {style: tomorrow, customStyle: style, language}

  // Add color to code tag props if custom color provided.
  if (style?.color) {
    prismProps.codeTagProps = {
      style: {
        color: 'inherit'
      }
    }
  }

  return (
    <>
      {!!content && (
        <div
          id={id || null}
          className={cn(styles.code, classNames.join(' '))}
          style={style}
        >
          {/* <SyntaxHighlighter {...prismProps}>
            {codeFormatter(content)}
          </SyntaxHighlighter> */}
          {/* <SyntaxHighlighter {...prismProps}> */}
          {content}
          {/* </SyntaxHighlighter> */}
        </div>
      )}
    </>
  )
}

Code.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
}
