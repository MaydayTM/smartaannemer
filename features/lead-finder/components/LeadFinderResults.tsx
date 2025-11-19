'use client'

import { useLeadFinderContext } from '../context/LeadFinderContext'
import { CheckCircle2, Building, Award, Phone, Mail, ExternalLink } from 'lucide-react'
import { formatPriceRange } from '@/lib/utils/pricing'

export function LeadFinderResults() {
  const { estimate, matchedContractors, setCurrentStep } = useLeadFinderContext()

  if (!estimate) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Estimate Section */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">Jouw indicatieve offerte</h3>
            <p className="text-sm text-slate-400">
              Gebaseerd op je projectgegevens
            </p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="text-3xl font-bold text-sky-300 mb-6">
          {formatPriceRange(estimate.min, estimate.max)}
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300">Kostenverdeling</h4>
          {Object.entries(estimate.breakdown).map(([key, [min, max]]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-slate-400 capitalize">{key}</span>
              <span className="text-slate-200">{formatPriceRange(min, max)}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-500">
          * Dit is een indicatieve schatting. De exacte prijs hangt af van je specifieke situatie.
        </p>
      </div>

      {/* Matched Contractors */}
      <div>
        <h3 className="text-xl font-semibold text-slate-100 mb-4">
          Geselecteerde aannemers ({matchedContractors.length})
        </h3>

        {matchedContractors.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center">
            <p className="text-slate-400">
              Geen aannemers gevonden voor jouw regio en project. Probeer een andere postcode.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matchedContractors.map((contractor) => (
              <div
                key={contractor.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-100">{contractor.name}</h4>
                    <p className="text-sm text-slate-400">{contractor.city}, {contractor.region}</p>
                  </div>
                  {contractor.rating && (
                    <div className="flex items-center gap-1 rounded-full bg-amber-400/10 border border-amber-400/30 px-3 py-1">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-semibold text-amber-300">{contractor.rating}</span>
                    </div>
                  )}
                </div>

                {contractor.notes && (
                  <p className="text-sm text-slate-300 mb-4">{contractor.notes}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {contractor.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      Geverifieerd
                    </span>
                  )}
                  {contractor.financiallyHealthy && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 border border-sky-500/30 px-3 py-1 text-xs text-sky-300">
                      Financieel gezond
                    </span>
                  )}
                  {contractor.fullGuidancePremiums && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs text-amber-300">
                      Premie-expert
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                  {contractor.phone && (
                    <a href={`tel:${contractor.phone}`} className="flex items-center gap-1 hover:text-slate-200">
                      <Phone className="w-4 h-4" />
                      {contractor.phone}
                    </a>
                  )}
                  {contractor.email && (
                    <a href={`mailto:${contractor.email}`} className="flex items-center gap-1 hover:text-slate-200">
                      <Mail className="w-4 h-4" />
                      {contractor.email}
                    </a>
                  )}
                  {contractor.website && (
                    <a
                      href={contractor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-slate-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-2">Volgende stappen</h4>
        <p className="text-sm text-slate-300 mb-4">
          Neem contact op met de aannemers die het beste bij jouw project passen.
          Ze kunnen je een exacte offerte geven na een bezoek ter plaatse.
        </p>
        <button
          onClick={() => setCurrentStep('contact')}
          className="rounded-full bg-amber-400 text-slate-950 font-semibold px-6 py-2 hover:bg-amber-300 transition-colors"
        >
          Bewaar mijn resultaten
        </button>
      </div>
    </div>
  )
}
