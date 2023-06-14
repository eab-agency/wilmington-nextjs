/**
 * Default Block
 *
 * The core Default block from Gutenberg.
 *
 * @param  {object}  props                    The component properties.
 * @param  {string}  props.content     HTML that comes from the WordPress editor.
 * @return {Element}                          The  component.
 */
export default function BlockDefault({ content }) {
  // filter out links that are internal to the site but keep image paths
  // const filteredContent = content.replace(
  //   /(?<=href=["'])(?!(?:https?:\/\/(?:www\.)?wilmington\.edu\/wp-content))(?:https?:\/\/(?:www\.)?wilmington\.edu)(?=[^"']*(?:["']|$))/g,
  //   ""
  // );
  const filteredContent =
    content &&
    content.replace(
      /(href=["'])(?!(?:https?:\/\/(?:www\.)?wilmington\.edu\/wp-content))(?:https?:\/\/(?:www\.)?wilmington\.edu)(?=[^"']*(?:["']|$))/g,
      '$1'
    )

  return (
    <>
      {/* if there is dynamicContent render set dangerously html */}
      {filteredContent && (
        <div
          className="wp-default-block"
          dangerouslySetInnerHTML={{ __html: filteredContent }}
        />
      )}
    </>
  )
}
