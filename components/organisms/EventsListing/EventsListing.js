import React from 'react';
import Heading from '@/components/atoms/Heading';
import NewsPost from '@/components/archive/NewsPost';
import Button from '@/components/atoms/Buttons/Button';
import * as styles from './EventsListing.module.scss';


function EventsListing({
  listing_display,
  listing_title,
  posts,
  showImage,
}) {
  return (
    // <div className={listing_display === '1' ? 'grid' : ''}>
    <section className={styles.eventsSection}>
      {/* <pre>FILE: EventsListing.tsx</pre> */}
      <div className={styles.sectionTag}>Events</div>
      <Heading tag="h2">{listing_title}</Heading>
      <ul className={styles.eventsList}>
        {posts.map((item, index) => (
          <li key={index}>
            <NewsPost post={item} ctx={undefined} showImage={showImage} />
          </li>
        ))}
      </ul>
      <Button url="/events" text="View All Events" />
    </section>
  );
}

export default EventsListing;
