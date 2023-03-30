import React from 'react';

export default function BlockHtml({ content }) {
  return (
    <div
      className="block-html"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
