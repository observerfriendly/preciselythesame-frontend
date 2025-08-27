'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // For now, just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-blue-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-6xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-blue-800 border border-blue-600 rounded-lg focus:outline-none focus:border-blue-400 text-white placeholder-blue-300"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-blue-800 border border-blue-600 rounded-lg focus:outline-none focus:border-blue-400 text-white placeholder-blue-300"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-lg font-semibold mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-blue-800 border border-blue-600 rounded-lg focus:outline-none focus:border-blue-400 text-white placeholder-blue-300 resize-vertical"
                placeholder="Tell us about your milk cap collection..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {submitStatus === 'success' && (
            <div className="mt-6 p-4 bg-green-800 border border-green-600 rounded-lg">
              <p className="text-green-200">Thank you! Your message has been sent successfully.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-6 p-4 bg-red-800 border border-red-600 rounded-lg">
              <p className="text-red-200">Sorry, there was an error sending your message. Please try again.</p>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-blue-200">hello@preciselythesame.com</p>
            </div>
            <div className="bg-blue-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-blue-200">San Francisco, CA</p>
            </div>
            <div className="bg-blue-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Collection</h3>
              <p className="text-blue-200">365+ Milk Caps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
