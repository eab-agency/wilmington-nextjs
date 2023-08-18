export function createMediaObject(other, i) {
  const mediaType = other[`hero_media_slider_${i}_media_type`]
  const media = {}

  if (mediaType === 'image') {
    const imageId = other[`hero_media_slider_${i}_image`]
    media.type = 'image'
    media.imageId = imageId
  } else if (mediaType === 'internal') {
    const internalId = other[`hero_media_slider_${i}_internal`]
    media.type = 'internal'
    media.imageId = internalId
  } else if (mediaType === 'external') {
    const externalUrl = other[`hero_media_slider_${i}_external`]
    media.type = 'external'
    media.url = externalUrl
  }

  const link = other[`hero_media_slider_${i}_link`]
  media.link = {
    title: link.title,
    url: link.url,
    target: link.target
  }

  return media
}

export function createCTAArray(other, ctaCount) {
  const ctas = []

  for (let i = 0; i < ctaCount; i++) {
    const cta = {
      title: other[`hero_primary_ctas_${i}_link`].title,
      url: other[`hero_primary_ctas_${i}_link`].url,
      target: other[`hero_primary_ctas_${i}_link`].target,
      icon: other[`hero_primary_ctas_${i}_icon`]
    }

    ctas.push(cta)
  }

  return ctas
}

// use like this
// const hero_media_slider_array = []

// for (let i = 0; i < hero_media_slider_count; i++) {
//   const media = createMediaObject(other, i)
//   hero_media_slider_array.push(media)
// }
