import * as React from 'react';
import Link from "@/components/common/Link"
import Image from 'next/image';


const AthleteCard = (props) => {
  const [showDescription, setShowDescription] = React.useState(false);

  const onMouseEnter = () => {
    setShowDescription(true);
  };

  const onMouseLeave = () => {
    setShowDescription(false);
  };

  const { title, image, description, link } = props;

  return (
    <>
      <pre>FILE: BlockAthleteCard.js</pre>
      <Link href={link}>
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <h3>{title}</h3>
          <Image image={image.gatsbyImage} alt={image.altText || ''} />
          {showDescription && <p>{description}</p>}
        </div>
      </Link>
    </>
  );
};

export default AthleteCard;
