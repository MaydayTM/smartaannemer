'use client'

import { useState } from 'react'
import { MapPin, Home, Calendar, Clock, Euro, Zap, ArrowRight, Loader2 } from 'lucide-react'
import { useLeadFinder } from '../context/LeadFinderContext'
import { useCredits } from '@/features/credits'
import { CreditStatusBar } from '@/features/credits'
import { ProjectType, BuildingType, Urgency, Priority } from '@/types/lead.types'

const PROJECT_TYPES: { value: ProjectType; label: string; icon: string }[] = [
  { value: 'roof', label: 'Dakrenovatie', icon: '🏠' },
  { value: 'facade', label: 'Gevelrenovatie', icon: '🧱' },
  { value: 'insulation', label: 'Isolatie', icon: '🧊' },
  { value: 'solar', label: 'Zonnepanelen', icon: '☀️' },
  { value: 'combo', label: 'Combinatie', icon: '🔄' },
]

const BUILDING_TYPES: { value: BuildingType; label: string }[] = [
  { value: 'apartment', label: 'Appartement' },
  { value: 'row', label: 'Rijwoning' },
  { value: 'semi_detached', label: 'Halfopen' },
  { value: 'detached', label: 'Vrijstaand' },
]

const URGENCY_OPTIONS: { value: Urgency; label: string }[] = [
  { value: '1-3m', label: '1-3 maanden' },
  { value: '3-6m', label: '3-6 maanden' },
  { value: '6-12m', label: '6-12 maanden' },
  { value: 'exploring', label: 'Aan het verkennen' },
]

export function LeadFinderForm() {
  const { formData, updateForm, submitEstimate, isEstimating, error, hasUsedCredit } = useLeadFinder()
  const { canUseCredit, useCredit, isLoading: creditLoading } = useCredits()

  const handleSubmit = async () => {
    if (!canUseCredit) return

    // Use credit first
    const creditUsed = await useCredit()
    if (!creditUsed) return

    // Then submit estimate
    await submitEstimate()
  }

  const isFormValid = formData.projectType && formData.buildingType

  return (
    <div className="space-y-6">
      {/* Credit Status */}
      <div className="flex justify-end">
        <CreditStatusBar />
      </div>

      {/* Address Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <MapPin className="h-4 w-4 text-sky-400" />
          Adres of postcode
        </label>
        <input
          type="text"
          placeholder="Bijv. 2000 Antwerpen of Straatnaam 123"
          value={formData.address}
          onChange={(e) => updateForm({ address: e.target.value })}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      {/* Project Type Pills */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Home className="h-4 w-4 text-sky-400" />
          Type project
        </label>
        <div className="flex flex-wrap gap-2">
          {PROJECT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => updateForm({ projectType: type.value })}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                formData.projectType === type.value
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <span>{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Building Type */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Home className="h-4 w-4 text-sky-400" />
          Type woning
        </label>
        <div className="grid grid-cols-2 gap-2">
          {BUILDING_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => updateForm({ buildingType: type.value })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                formData.buildingType === type.value
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Year Built */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Calendar className="h-4 w-4 text-sky-400" />
          Bouwjaar (optioneel)
        </label>
        <input
          type="number"
          placeholder="Bijv. 1985"
          min="1800"
          max={new Date().getFullYear()}
          value={formData.yearBuilt || ''}
          onChange={(e) => updateForm({ yearBuilt: e.target.value ? parseInt(e.target.value) : null })}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      {/* Urgency */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Clock className="h-4 w-4 text-sky-400" />
          Wanneer wil je starten?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {URGENCY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateForm({ urgency: option.value })}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                formData.urgency === option.value
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Euro className="h-4 w-4 text-sky-400" />
          Geschat budget
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="5000"
            max="100000"
            step="1000"
            value={formData.budgetRange[1]}
            onChange={(e) => updateForm({ budgetRange: [5000, parseInt(e.target.value)] })}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <span className="text-sm text-slate-300 w-24 text-right">
            tot €{formData.budgetRange[1].toLocaleString('nl-BE')}
          </span>
        </div>
      </div>

      {/* Priority Toggle */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
          <Zap className="h-4 w-4 text-sky-400" />
          Prioriteit
        </label>
        <div className="flex rounded-lg border border-slate-700 overflow-hidden">
          {(['price', 'balance', 'quality'] as Priority[]).map((p) => (
            <button
              key={p}
              onClick={() => updateForm({ priority: p })}
              className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                formData.priority === p
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p === 'price' ? 'Prijs' : p === 'balance' ? 'Balans' : 'Kwaliteit'}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || !canUseCredit || isEstimating || creditLoading || hasUsedCredit}
        className={`w-full rounded-full py-3.5 text-base font-semibold transition-all flex items-center justify-center gap-2 ${
          isFormValid && canUseCredit && !hasUsedCredit
            ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg shadow-amber-400/30'
            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
        }`}
      >
        {isEstimating || creditLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Berekenen...
          </>
        ) : hasUsedCredit ? (
          'Krediet gebruikt'
        ) : (
          <>
            Gebruik mijn gratis krediet
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </div>
  )
}
