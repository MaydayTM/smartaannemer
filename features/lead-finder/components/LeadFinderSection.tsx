'use client'

import { LeadFinderProvider, useLeadFinderContext } from '../context/LeadFinderContext'
import { LeadFinderForm } from './LeadFinderForm'
import { ContactForm } from './ContactForm'
import { LeadFinderResults } from './LeadFinderResults'
import { Sparkles } from 'lucide-react'

function LeadFinderContent() {
  const { currentStep, isLoading, error } = useLeadFinderContext()

  return (
    <section id="tool" className="border-b border-slate-900 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-2 text-sm text-sky-200 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Vind jouw perfecte aannemer</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-50 mb-4">
            Lead Finder Tool
          </h2>
          <p className="text-lg text-slate-300">
            Vul je gegevens in en krijg direct een indicatieve offerte plus matches met geverifieerde aannemers.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-sky-500 mb-4"></div>
            <p className="text-slate-400">Bezig met berekenen...</p>
          </div>
        ) : (
          <>
            {/* Multi-step wizard */}
            {currentStep === 'form' && <LeadFinderForm />}
            {currentStep === 'contact' && <ContactForm />}
            {currentStep === 'results' && <LeadFinderResults />}
          </>
        )}
      </div>
    </section>
  )
}

export function LeadFinderSection() {
  return (
    <LeadFinderProvider>
      <LeadFinderContent />
    </LeadFinderProvider>
  )
}
