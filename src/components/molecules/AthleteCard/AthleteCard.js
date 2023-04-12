'use client'

import React, { useState } from 'react';
import Link from "@/components/common/Link"
import Image from '@/components/atoms/Image';


const AthleteCard = ({ title, image, description, link }) => {
  const [showDescription, setShowDescription] = useState(false);

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  return (
    <>
      <pre>FILE: BlockAthleteCard.js</pre>
      <Link href={link}>
        <div onMouseEnter={toggleDescription} onMouseLeave={toggleDescription}>
          <h3>{title}</h3>
          <Image url={image.mediaItemUrl}
            alt={image.altText}
            imageMeta={{ mediaDetails: image.mediaDetails }}
          />
          {showDescription && <p>{description}</p>}
        </div>
      </Link>
    </>
  );
};

export default AthleteCard;
