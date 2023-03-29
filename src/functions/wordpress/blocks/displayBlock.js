import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

// Import WP blocks using Next Dynamic Imports
// @see https://nextjs.org/docs/advanced-features/dynamic-import

/**
 * Decide which block component to display.
 *
 * @param  {object}  block The block data.
 * @param  {number}  index A unique key required by React.
 * @return {Element}       A block-based component.
 */
export default function displayBlock(block, index) {
  const { attributes, name, innerBlocks } = block

  // prettier-ignore
  switch (name) {
    /* -- CORE BLOCKS -- */
    case 'core/button': {
      const BlockButton = dynamic(() => import('@/components/blocks/core/BlockButton'))
      return <BlockButton {...attributes} key={index} />
    }

    case 'core/buttons': {
      const BlockButtons = dynamic(() => import('@/components/blocks/core/BlockButtons'))
      return <BlockButtons {...attributes} innerBlocks={innerBlocks} key={index} />
    }

    case 'core/code':
    case 'core/preformatted': {
      const BlockCode = dynamic(() => import('@/components/blocks/core/BlockCode'))
      return <BlockCode {...attributes} key={index} />
    }

    case 'core/columns': {
      const BlockColumns = dynamic(() => import('@/components/blocks/core/BlockColumns'))
      return <BlockColumns {...attributes} innerBlocks={innerBlocks} key={index} />
    }

    case 'core/cover': {
      const BlockCover = dynamic(() => import('@/components/blocks/core/BlockCover'))
      return <BlockCover {...attributes} innerBlocks={innerBlocks} key={index} />
    }

    case 'core/embed': {
      const BlockEmbed = dynamic(() => import('@/components/blocks/core/BlockEmbed'))
      return <BlockEmbed {...attributes} key={index} />
    }

    case 'core/gallery': {
      const BlockImageGallery = dynamic(() => import('@/components/blocks/core/BlockImageGallery'))
      return <BlockImageGallery {...attributes} key={index} />
    }

    case 'core/heading': {
      const BlockHeadings = dynamic(() => import('@/components/blocks/core/BlockHeadings'))
      return <BlockHeadings {...attributes} key={index} />
    }

    case 'core/image': {
      const BlockImage = dynamic(() => import('@/components/blocks/core/BlockImage'))
      return <BlockImage {...attributes} key={index} />
    }

    case 'core/list': {
      const BlockList = dynamic(() => import('@/components/blocks/core/BlockList'))
      return <BlockList {...attributes} key={index} />
    }

    case 'core/media-text': {
      const BlockMediaText = dynamic(() => import('@/components/blocks/core/BlockMediaText'))
      return <BlockMediaText {...attributes} innerBlocks={innerBlocks} key={index} />
    }

    case 'core/paragraph': {
      const BlockParagraph = dynamic(() => import('@/components/blocks/core/BlockParagraph'))
      return <BlockParagraph {...attributes} key={index} />
    }

    case 'core/pullquote': {
      const BlockPullQuote = dynamic(() => import('@/components/blocks/core/BlockPullQuote'))
      return <BlockPullQuote {...attributes} key={index} />
    }

    case 'core/quote': {
      const BlockQuote = dynamic(() => import('@/components/blocks/core/BlockQuote'))
      return <BlockQuote {...attributes} key={index} />
    }

    case 'core/separator': {
      const BlockSeparator = dynamic(() => import('@/components/blocks/core/BlockSeparator'))
      return <BlockSeparator {...attributes} key={index} />
    }

    case 'core/spacer': {
      const BlockSpacer = dynamic(() => import('@/components/blocks/core/BlockSpacer'))
      return <BlockSpacer {...attributes} key={index} />
    }

    case 'core/table': {
      const BlockTable = dynamic(() => import('@/components/blocks/core/BlockTable'))
      return <BlockTable {...attributes} key={index} />
    }


    case 'core/group': {
      const BlockGroup = dynamic(() => import('@/components/blocks/core/BlockGroup'))
      return <BlockGroup {...attributes} innerBlocks={innerBlocks} key={index} />
    }

    // this takes care of the orginal default block
    case 'core/freeform': {
      const BlockDefault = dynamic(() => import('@/components/blocks/core/BlockDefault'))
      return <BlockDefault content={attributes.content} key={index} />
    }

    case 'acf/home-hero': {
      const BlockHomeHero = dynamic(() => import('@/components/blocks/acf/BlockHomeHero'))
      return (
        <BlockHomeHero
          {...attributes}
          innerBlocks={innerBlocks}
          key={index}
        />
      );
    }

    case 'acf/news-listing': {
      const BlockNewsListing = dynamic(() => import('@/components/blocks/acf/BlockNewsListing'))
      return <BlockNewsListing {...attributes} key={index} />;
    }

    case 'acf/events-listing': {
      const BlockEventsListing = dynamic(() => import('@/components/blocks/acf/BlockEventsListing'))
      return <BlockEventsListing {...attributes} key={index} />;
    }

    case 'acf/featured-dept': {
      const BlockFeaturedPrograms = dynamic(() => import('@/components/blocks/acf/BlockFeaturedPrograms'))
      return <BlockFeaturedPrograms {...attributes} key={index} />;
    }

    case 'acf/testimonial-block': {
      const BlockTestimonial = dynamic(() => import('@/components/blocks/acf/BlockTestimonial'))
      return (
        <BlockTestimonial
          {...attributes}
          key={index}
        />
      );
    }

    case 'acf/home-tab': {
      const BlockHomeTabs = dynamic(() => import('@/components/blocks/acf/BlockHomeTabs'))
      return <BlockHomeTabs {...attributes.data} key={index} />;
    }

    case 'acf/faculty-card': {
      const BlockFacultyCard = dynamic(() => import('@/components/blocks/acf/BlockFacultyCard'))
      return <BlockFacultyCard {...attributes} key={index} />;
    }

    case 'acf/athlete-card': {
      const BlockAthleteCard = dynamic(() => import('@/components/blocks/acf/BlockAthleteCard'))
      return <BlockAthleteCard {...attributes} key={index} />;
    }

    case 'acf/related-programs': {
      const BlockRelatedPrograms = dynamic(() => import('@/components/blocks/acf/BlockRelatedPrograms'))
      return <BlockRelatedPrograms {...attributes} key={index} />;
    }

    default:
      return <pre key={index}>{JSON.stringify(block, null, 2)}</pre>
  }
}

displayBlock.propTypes = {
  block: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
}
