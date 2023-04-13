import HTMLReactParser from 'html-react-parser'

const ParsedContent = ({ content }) => {
  if (typeof content !== 'string') {
    return content
  }
  if (content === '') {
    return []
  }
  return HTMLReactParser(content)
}

export default ParsedContent
