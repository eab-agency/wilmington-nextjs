// maps over blocks and returns an array of objects with anchor and content

export default function getJumpLinks(blocks) {
  if (!Array.isArray(blocks)) {
    return []
  }
  const results = []

  function traverse(block) {
    if (
      block.name === 'core/heading' &&
      block.attributes.anchor &&
      block.attributes.anchor.startsWith('jump')
    ) {
      results.push({
        anchor: block.attributes.anchor,
        content: block.attributes.content
      })
    }

    if (block.children && block.children.length > 0) {
      for (const child of block.children) {
        traverse(child)
      }
    }
  }

  for (const item of blocks) {
    traverse(item)
  }

  return results
}
