'use client'

import { useState } from 'react'
import { useLeadFinderContext } from '../context/LeadFinderContext'
import { User, Mail, Phone } from 'lucide-react'

export function ContactForm() {
  const {
    formData,
    contactInfo,
    setContactInfo,
    setEstimate,
    setMatchedContractors,
    setCurrentStep,
    setIsLoading,
    setError
  } = useLeadFinderContext()

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate contact info
    const newErrors: Record<string, string> = {}

    if (!contactInfo.firstName || contactInfo.firstName.length < 2) {
      newErrors.firstName = 'Voornaam is verplicht (min. 2 karakters)'
    }
    if (!contactInfo.lastName || contactInfo.lastName.length < 2) {
      newErrors.lastName = 'Achternaam is verplicht (min. 2 karakters)'
    }
    if (!contactInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = 'Geldig e-mailadres is verplicht'
    }
    if (!contactInfo.phone || contactInfo.phone.length < 9) {
      newErrors.phone = 'Telefoonnummer is verplicht'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, contactInfo }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      const result = await response.json()

      // Update context with results
      setEstimate(result.estimate)
      setMatchedContractors(result.contractors)
      setCurrentStep('results')
    } catch (error) {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-slate-100 mb-2">
          Bijna klaar!
        </h3>
        <p className="text-slate-300">
          Vul je contactgegevens in en we verbinden je met de beste aannemers voor jouw project.
        </p>
      </div>

      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Voornaam *
          </label>
          <input
            id="firstName"
            type="text"
            value={contactInfo.firstName || ''}
            onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Jan"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Achternaam *
          </label>
          <input
            id="lastName"
            type="text"
            value={contactInfo.lastName || ''}
            onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Janssens"
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            E-mailadres *
          </label>
          <input
            id="email"
            type="email"
            value={contactInfo.email || ''}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="jan.janssens@email.be"
          />
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Telefoonnummer *
          </label>
          <input
            id="phone"
            type="tel"
            value={contactInfo.phone || ''}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="0470 12 34 56"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
        </div>

        {/* Extra Info (Optional) */}
        <div>
          <label htmlFor="extraInfo" className="block text-sm font-medium text-slate-300 mb-2">
            Extra informatie (optioneel)
          </label>
          <textarea
            id="extraInfo"
            value={contactInfo.extraInfo || ''}
            onChange={(e) => setContactInfo({ ...contactInfo, extraInfo: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Vertel ons meer over je project..."
            maxLength={500}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep('form')}
          className="flex-1 rounded-full border border-slate-700 bg-slate-900 text-slate-100 font-semibold px-8 py-3 hover:bg-slate-800 transition-colors"
        >
          Terug
        </button>
        <button
          type="submit"
          className="flex-1 rounded-full bg-amber-400 text-slate-950 font-semibold px-8 py-3 shadow-lg shadow-amber-400/30 hover:bg-amber-300 transition-colors"
        >
          Toon resultaten
        </button>
      </div>

      <p className="text-xs text-center text-slate-500">
        We respecteren je privacy en delen je gegevens niet met derden.
      </p>
    </form>
  )
}
