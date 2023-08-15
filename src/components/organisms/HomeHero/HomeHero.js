import MainCta from '@/components/atoms/Buttons/MainCta'
import Image from '@/components/atoms/Image'
import RichText from '@/components/atoms/RichText'
import VideoPlayer from '@/components/atoms/VideoPlayer'
import styles from './HomeHero.module.scss'

function Hero({ mediaItems, content, ctas }) {
  return (
    <div className={styles.homeHero}>
      {mediaItems.map((item, index) => {
        if (item.type === 'image') {
          return (
            <Image
              key={index}
              className={styles.heroImage}
              alt={item.mediaItem.altText}
              priority={true}
              imageMeta={item.mediaItem}
            />
          )
        } else if (item.type === 'internal') {
          return (
            <VideoPlayer
              key={index}
              className={styles.heroVideo}
              src={item.mediaItem.mediaItemUrl}
              autoPlay={true}
            />
          )
        } else {
          return null
        }
      })}
      <div className={styles.heroIntroContent}>
        <div className={styles.introCopy}>
          <RichText tag="div">{content}</RichText>
        </div>
        <ul className={styles.ctasRow}>
          {ctas.map((cta, index) => (
            <li key={index}>
              <MainCta
                key={index}
                text={cta.title}
                icon={cta.icon}
                url={cta.url}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Hero
