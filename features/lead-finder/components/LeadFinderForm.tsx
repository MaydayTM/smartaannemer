'use client'

import { useState } from 'react'
import { useLeadFinderContext } from '../context/LeadFinderContext'
import { useCreditContext } from '@/features/credits/context/CreditContext'
import { leadFinderFormSchema } from '@/lib/validation/lead-finder.schemas'
import { Home, Building2, Calendar, Zap } from 'lucide-react'
import type { ProjectType, BuildingType, Urgency, Priority } from '@/types/lead.types'

export function LeadFinderForm() {
  const { formData, setFormData, setEstimate, setMatchedContractors, setCurrentStep, setIsLoading, setError } = useLeadFinderContext()
  const { canUseCredit } = useCreditContext()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data using Zod schema
    const validation = leadFinderFormSchema.safeParse(formData)

    if (!validation.success) {
      // Map Zod errors to error state
      const newErrors: Record<string, string> = {}
      validation.error.issues.forEach((err) => {
        if (err.path.length > 0) {
          newErrors[err.path[0].toString()] = err.message
        }
      })
      setErrors(newErrors)
      return
    }

    if (!canUseCredit) {
      setError('Je hebt geen credits meer beschikbaar')
      return
    }

    // Move to contact form step
    setCurrentStep('contact')
  }

  const projectTypes: { value: ProjectType; label: string; icon: any }[] = [
    { value: 'roof', label: 'Dak renovatie', icon: Home },
    { value: 'facade', label: 'Gevel renovatie', icon: Building2 },
    { value: 'insulation', label: 'Isolatie', icon: Home },
    { value: 'solar', label: 'Zonnepanelen', icon: Zap },
    { value: 'combo', label: 'Combinatie', icon: Building2 },
  ]

  const buildingTypes: { value: BuildingType; label: string }[] = [
    { value: 'row', label: 'Rijwoning' },
    { value: 'semi_detached', label: 'Halfopen woning' },
    { value: 'detached', label: 'Vrijstaande woning' },
    { value: 'apartment', label: 'Appartement' },
  ]

  const urgencyOptions: { value: Urgency; label: string }[] = [
    { value: '1-3m', label: '1-3 maanden' },
    { value: '3-6m', label: '3-6 maanden' },
    { value: '6-12m', label: '6-12 maanden' },
    { value: 'exploring', label: 'Ik ben aan het verkennen' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Projectadres</h3>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-2">
            Straat en nummer
          </label>
          <input
            id="address"
            type="text"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Voorbeeld: Kerkstraat 123"
          />
          {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-slate-300 mb-2">
              Postcode
            </label>
            <input
              id="postalCode"
              type="text"
              value={formData.postalCode || ''}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="2000"
              maxLength={4}
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-400">{errors.postalCode}</p>}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-2">
              Stad
            </label>
            <input
              id="city"
              type="text"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Antwerpen"
            />
            {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city}</p>}
          </div>
        </div>
      </div>

      {/* Project Type */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Type project</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {projectTypes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData({ ...formData, projectType: value })}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                formData.projectType === value
                  ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
        {errors.projectType && <p className="mt-1 text-sm text-red-400">{errors.projectType}</p>}
      </div>

      {/* Building Type */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Type woning</h3>
        <div className="grid grid-cols-2 gap-3">
          {buildingTypes.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData({ ...formData, buildingType: value })}
              className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                formData.buildingType === value
                  ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.buildingType && <p className="mt-1 text-sm text-red-400">{errors.buildingType}</p>}
      </div>

      {/* Year Built */}
      <div className="space-y-4">
        <label htmlFor="yearBuilt" className="block text-lg font-semibold text-slate-100">
          Bouwjaar (optioneel)
        </label>
        <input
          id="yearBuilt"
          type="number"
          value={formData.yearBuilt || ''}
          onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value ? parseInt(e.target.value) : null })}
          className="w-full max-w-xs rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="1990"
          min={1900}
          max={new Date().getFullYear()}
        />
      </div>

      {/* Urgency */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Wanneer wil je starten?</h3>
        <div className="grid grid-cols-2 gap-3">
          {urgencyOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData({ ...formData, urgency: value })}
              className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                formData.urgency === value
                  ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.urgency && <p className="mt-1 text-sm text-red-400">{errors.urgency}</p>}
      </div>

      {/* Budget Range */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Indicatief budget</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-300">
            <span>€{formData.budgetRange?.[0].toLocaleString('nl-BE') || '10.000'}</span>
            <span>€{formData.budgetRange?.[1].toLocaleString('nl-BE') || '30.000'}</span>
          </div>
          <input
            type="range"
            min="5000"
            max="100000"
            step="1000"
            value={formData.budgetRange?.[1] || 30000}
            onChange={(e) => setFormData({
              ...formData,
              budgetRange: [formData.budgetRange?.[0] || 10000, parseInt(e.target.value)]
            })}
            className="w-full"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!canUseCredit}
        className="w-full rounded-full bg-amber-400 text-slate-950 font-semibold px-8 py-3 shadow-lg shadow-amber-400/30 hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Bereken mijn offerte
      </button>
    </form>
  )
}
