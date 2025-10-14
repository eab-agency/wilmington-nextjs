import Columns from '@/components/atoms/Columns'
import { gql } from '@apollo/client'
import { WordPressBlocksViewer } from '@faustwp/blocks'
import { useEffect } from 'react'

/**
 * See the CoreParagraph for details on how these blocks are structured.
 *
 * @see ./CoreParagraph.js
 */
export default function CoreColumns(props) {
  const attributes = props.attributes

  // Extract and execute scripts from renderedHtml
  useEffect(() => {
    if (props.renderedHtml) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(props.renderedHtml, 'text/html')
      const scripts = doc.querySelectorAll('script')

      const addedScripts = []

      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script')

        // Copy all attributes
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value)
        })

        // Copy inline script content if any
        if (oldScript.textContent) {
          newScript.textContent = oldScript.textContent
        }

        // Append to body to execute
        document.body.appendChild(newScript)
        addedScripts.push(newScript)
      })

      // Cleanup function to remove scripts when component unmounts
      return () => {
        addedScripts.forEach((script) => {
          if (script.parentNode) {
            script.parentNode.removeChild(script)
          }
        })
      }
    }
  }, [props.renderedHtml])

  return (
    <Columns
      id={attributes?.anchor}
      className={attributes?.className}
      columnCount={props?.children?.length}
      style={attributes?.style}
      verticalAlignment={attributes?.verticalAlignment}
      isStackedOnMobile={attributes?.isStackedOnMobile}
      backgroundColor={attributes?.backgroundColor}
    >
      <WordPressBlocksViewer blocks={props?.children ?? []} />
    </Columns>
  )
}

CoreColumns.fragments = {
  entry: gql`
    fragment CoreColumnsFragment on CoreColumns {
      attributes {
        anchor
        className
        cssClassName
        style
        verticalAlignment
        isStackedOnMobile
        backgroundColor
      }
      renderedHtml
    }
  `,
  key: `CoreColumnsFragment`
}

CoreColumns.displayName = 'CoreColumns'
