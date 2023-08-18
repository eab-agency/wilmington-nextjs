import MainCta from '@/components/atoms/Buttons/MainCta'
import RichText from '@/components/atoms/RichText'
import SimpleCarousel from '@/components/organisms/SimpleCarousel'
import styles from './HomeHero.module.scss'

function Hero({ mediaItems, content, ctas }) {
  return (
    <div className={styles.homeHero}>
      <SimpleCarousel mediaItems={mediaItems} />
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
