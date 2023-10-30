import { gql } from '@apollo/client';
import { useEffect } from 'react';

const EabProgramJumplinks = (props) => {
  const { jumpLinks } = props.attributes
  const parsedJumpLinks = JSON.parse(jumpLinks);

  useEffect(() => {
    const headHeight = document.querySelector('#page-header').offsetHeight;
    const jumpLinksGroup = document.querySelectorAll('.jumpLink');

    const handleClick = (e) => {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute('href'));
      const targetOffset = target.getBoundingClientRect().top + window.pageYOffset - headHeight;
      window.scrollTo({
        top: targetOffset,
        behavior: "smooth"
      });
    }

    jumpLinksGroup.forEach(link => {
      link.addEventListener('click', handleClick);
    });

    return () => {
      jumpLinksGroup.forEach(link => {
        link.removeEventListener('click', handleClick);
      });
    }
  }, []);



  return (
    <div className="wp-block-eab-program-jumplinks">
      <section>
        <h3>On this page</h3>
        <ul>
          {parsedJumpLinks.map((block, index) => (
            <li key={index}>
              <a href={`#${block.id}`} className='jumpLink'>{block.rawHtml}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>)
}

export default EabProgramJumplinks

EabProgramJumplinks.fragments = {
  entry: gql`
    fragment EabProgramJumplinksFragment on EabProgramJumplinks {
      attributes {
        jumpLinks
      }
    }
  `,
  key: `EabProgramJumplinksFragment`
}

EabProgramJumplinks.displayName = 'EabProgramJumplinks'
