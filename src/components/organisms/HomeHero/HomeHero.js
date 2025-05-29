import MainCta from '@/components/atoms/Buttons/MainCta'
import RichText from '@/components/atoms/RichText'
import ModalButton from '@/components/molecules/ModalButton/ModalButton'
import SimpleCarousel from '@/components/organisms/SimpleCarousel'
import styles from './HomeHero.module.scss'

function Hero({
  mediaItems,
  content,
  description = [],
  ctas = [],
  modalButtons = []
}) {
  return (
    <div className={styles.homeHero}>
      <SimpleCarousel mediaItems={mediaItems} />
      <div className={styles.heroIntroContent}>
        <div className={styles.introCopy}>
          {content?.length > 0 && <RichText tag="h1">{content}</RichText>}
          {description.length > 0 && (
            <div className={styles.description}>
              {description.map((paragraph, index) => (
                <RichText key={index} tag="p">
                  {paragraph}
                </RichText>
              ))}
            </div>
          )}
          {modalButtons.length > 0 && (
            <div className={styles.modalButtonWrapper}>
              {modalButtons.map(
                (modalButton, index) =>
                  modalButton.url && (
                    <ModalButton key={index} {...modalButton} />
                  )
              )}
            </div>
          )}
        </div>
        <ul className={styles.ctasRow}>
          {ctas.map((cta, index) => (
            <li key={index}>
              <MainCta
                key={index}
                text={cta.title}
                url={cta.url}
                icon={cta.icon}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Hero
