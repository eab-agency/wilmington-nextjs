import SectionTag from '@/components/atoms/SectionTag/SectionTag'
import Testimonial from '@/components/molecules/Testimonial'
import styles from './BlockTestimonial.module.scss'

export default function BlockTestimonial({ featuredTestimonial, random }) {
  console.log(
    '🚀🚀🚀 ~ file: BlockTestimonial.js:6 ~ BlockTestimonial ~ random:',
    random
  )
  return (
    <div className="testimonials">
      <SectionTag text="Testimonials" className={styles.testimonialTag} />
      <Testimonial
        post={featuredTestimonial}
        viewAllLink={true}
        featuredTestimonial={true}
      />
      {/* {random && <pre>multiple testimonial to follow</pre>} */}
      <div className={styles.randomTestimonials}>
        {random &&
          random.map((item, index) => (
            <Testimonial
              post={item}
              viewAllLink={false}
              imageOnly={true}
              key={index}
            />
          ))}
      </div>
    </div>
  )
}
