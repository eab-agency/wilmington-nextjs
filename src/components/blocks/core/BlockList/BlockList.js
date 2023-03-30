import React from 'react';
import Blocks from '@/components/molecules/Blocks';

export default function BlockList({
  className,
  ordered,
  reversed,
  start,
  anchor,
  innerBlocks,
  pageContext,
}) {
  const Tag = ordered ? 'ol' : 'ul';

  return (
    <Tag
      className={className}
      id={anchor || null}
      reversed={reversed}
      start={start}
    >
      {!!innerBlocks?.length && (
        <Blocks
          blocks={innerBlocks}
          where="blockList"
          pageContext={pageContext}
        />
      )}
    </Tag>
  );
}
