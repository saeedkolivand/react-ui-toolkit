import React, { useState } from 'react'
import { Button, Card, Textarea, Switch, Checkbox } from '@saeedkolivand/react-ui-toolkit'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    acceptTerms: false,
    receiveUpdates: false
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        alert('Form submitted successfully!')
        setFormData({
          name: '',
          email: '',
          message: '',
          acceptTerms: false,
          receiveUpdates: false
        })
      }, 1500)
    }
  }

  return (
    <Card>
      <Card.Header>
        <h2 className="text-xl font-semibold">Contact Us</h2>
        <p className="text-gray-500 dark:text-gray-400">We'd love to hear from you</p>
      </Card.Header>

      <Card.Body className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            placeholder="Your name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <Textarea
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="What would you like to tell us?"
          rows={4}
          error={errors.message}
          maxLength={500}
          showCount
        />

        <Checkbox
          name="acceptTerms"
          label="I accept the terms and conditions"
          checked={formData.acceptTerms}
          onChange={handleChange}
          error={errors.acceptTerms}
        />

        <Switch
          name="receiveUpdates"
          label="Receive updates about our products"
          checked={formData.receiveUpdates}
          onChange={handleChange}
          helperText="We'll never spam you or share your information"
        />
      </Card.Body>

      <Card.Footer>
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </Card.Footer>
    </Card>
  )
}
