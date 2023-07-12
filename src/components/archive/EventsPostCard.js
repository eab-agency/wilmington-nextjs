/* eslint-disable no-unused-vars */
import Button from '@/components/atoms/Buttons/Button'
import Image from '@/components/atoms/Image'
import TheDate from '@/components/atoms/TheDate'
// import { className } from 'classnames/bind'
import EventIcon from '../atoms/EventIcon'

const EventsPost = ({
  isFirst = false,
  post,
  className = null,
  ctx,
  showImage = true,
  isFrontPage = false,
  ...props
}) => {
  // if post is null or undefined, return null
  if (!post) return null

  const { title, date, featuredImage, uri, excerpt, eventsFields } = post

  const { node: { sourceUrl, altText, mediaDetails } = {} } =
    featuredImage || {}

  // destructure the eventsFields object
  const {
    event: {
      startDate,
      startTime,
      endDate,
      endTime,
      locationName,
      locationAddress,
      featured
    } = {}
  } = eventsFields || {}

  return (
    <article className={className} {...props}>
      {!isFrontPage && sourceUrl && showImage ? (
        <Image url={sourceUrl} alt={altText} imageMeta={{ mediaDetails }} />
      ) : null}
      <div className="newsContentContainer">
        <TheDate date={startDate} />
        <h3 className="articleTitle">{title}</h3>
        {startTime && !endTime ? (
          <p>
            <EventIcon icon="time" />
            {startTime}
          </p>
        ) : (
          <p>
            <EventIcon icon="time" />
            {startTime} - {endTime}
          </p>
        )}
        {endDate && (
          <p>
            Ends:
            <EventIcon icon="calendar" />
            {endDate}
          </p>
        )}
        {endTime && (
          <p>
            <EventIcon icon="location" />
            {endTime}
          </p>
        )}
        {locationAddress && (
          <address>
            <EventIcon icon="location" />
            <div>
              {locationName && (
                <>
                  <strong>{locationName}</strong>
                  <br />
                </>
              )}
              <div>{locationAddress}</div>
            </div>
          </address>
        )}
        {featured && <p>{featured}</p>}
        <Button
          className="articleLink"
          url={uri}
          type="regularlink"
          text="Read More"
        />
      </div>
    </article>
  )
}

export default EventsPost
