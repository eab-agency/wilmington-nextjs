import React, { useEffect, useState } from 'react'
import Form from './Form'

const FormStack = ({ formId }) => {
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`/api/formstack?formId=${formId}`)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setFormData(data)
      } catch (error) {
        console.error('Error fetching form data:', error)
      }
    }

    fetchFormData()
  }, [formId])

  if (!formData) {
    return <div>Loading...</div>
  }

  return <Form formData={formData} />
}

export default FormStack
