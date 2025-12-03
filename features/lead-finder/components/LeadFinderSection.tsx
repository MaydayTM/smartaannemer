'use client'

import { Sparkles } from 'lucide-react'
import { LeadFinderProvider } from '../context/LeadFinderContext'
import { LeadFinderForm } from './LeadFinderForm'
import { LeadFinderResults } from './LeadFinderResults'
import { CreditProvider } from '@/features/credits'

function LeadFinderContent() {
  return (
    <section id="tool" className="border-t border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-3 py-1 text-xs md:text-sm text-sky-200 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-gestuurde renovatietool</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-50 mb-3">
            Bereken je renovatiebudget
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            Vul je gegevens in en ontvang direct een indicatieve prijsschatting plus een match met gescreende aannemers in jouw regio.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-slate-100 mb-6">
              Jouw project
            </h3>
            <LeadFinderForm />
          </div>

          {/* Right: Results */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-slate-100 mb-6">
              Resultaat
            </h3>
            <LeadFinderResults />
          </div>
        </div>
      </div>
    </section>
  )
}

export function LeadFinderSection() {
  return (
    <CreditProvider>
      <LeadFinderProvider>
        <LeadFinderContent />
      </LeadFinderProvider>
    </CreditProvider>
  )
}
