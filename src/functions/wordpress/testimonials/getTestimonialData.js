import { initializeWpApollo } from '@/lib/wordpress/connector'
import queryTestimonyAttributes, { queryTestimonies } from '@/lib/wordpress/testimonies/queryTestimonyAttributes'

/**
 * Retrieve testimony details by ID.
 *
 * @author WebDevStudios
 * @param  {number} id The media's database ID.
 * @return {object}    Object containing Apollo client instance and post data or error object.
 */
export default async function getTestimonyByID(id) {
    // No ID? Bail...
    if (!id) {
        return {}
    }

    // Get/create Apollo instance.
    const apolloClient = initializeWpApollo()

    // Execute query.
    const testimony = await apolloClient
        .query({
            query: queryTestimonyAttributes,
            variables: {
                id: id
            }
        })
        .then((response) => {
            return (response?.data?.testimonial ?? null)
        })
        .catch((error) => {
            return {
                isError: true,
                message: error.message
            }
        })

    return testimony
}


export async function getRandomTestimonials(testimonyIdToFilterOut) {
    // Get/create Apollo instance.
    const apolloClient = initializeWpApollo()

    // Execute query.
    const testimonies = await apolloClient
        .query({
            query: queryTestimonies,
            variables: {
                id: testimonyIdToFilterOut
            }
        })
        .then((response) => {
            const testimonials = response.data.testimonials.nodes;

            // Filter out any object with a databaseId of 687
            const filteredTestimonials = testimonials.filter(testimonial => testimonial.databaseId !== testimonyIdToFilterOut);

            // Generate two random indices
            const randomIndex1 = Math.floor(Math.random() * filteredTestimonials.length);
            let randomIndex2 = Math.floor(Math.random() * filteredTestimonials.length);

            // Make sure the two indices are different
            while (randomIndex2 === randomIndex1) {
                randomIndex2 = Math.floor(Math.random() * filteredTestimonials.length);
            }

            // Pick the two testimonials at the random indices and push them into a new array
            const selectedTestimonials = [];
            selectedTestimonials.push(filteredTestimonials[randomIndex1]);
            selectedTestimonials.push(filteredTestimonials[randomIndex2]);

            // Return the selected testimonials array
            return selectedTestimonials;
        })
        .catch((error) => {
            return {
                isError: true,
                message: error.message
            }
        })

    return testimonies
}

function getTwoRandomTestimonies(testimonyToRemove) {

    const testimonials = response.data.testimonials.nodes;

    // Filter out any object with a databaseId of 687
    const filteredTestimonials = testimonials.filter(testimonial => testimonial.databaseId !== 687);

    // Generate two random indices
    const randomIndex1 = Math.floor(Math.random() * filteredTestimonials.length);
    let randomIndex2 = Math.floor(Math.random() * filteredTestimonials.length);

    // Make sure the two indices are different
    while (randomIndex2 === randomIndex1) {
        randomIndex2 = Math.floor(Math.random() * filteredTestimonials.length);
    }

    // Pick the two testimonials at the random indices and push them into a new array
    const selectedTestimonials = [];
    selectedTestimonials.push(filteredTestimonials[randomIndex1]);
    selectedTestimonials.push(filteredTestimonials[randomIndex2]);

    // Return the selected testimonials array
    return selectedTestimonials;



}