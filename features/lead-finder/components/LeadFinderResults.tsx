'use client'

import { Check, Star, Shield, TrendingUp, Building2, Phone, Mail } from 'lucide-react'
import { useLeadFinder } from '../context/LeadFinderContext'
import { formatPrice, formatPriceRange } from '@/lib/utils/pricing'
import { Contractor } from '@/types/contractor.types'

function PriceBreakdown() {
  const { estimate } = useLeadFinder()

  if (!estimate) return null

  const breakdownItems = [
    { label: 'Materialen', range: estimate.breakdown.materials },
    { label: 'Arbeid', range: estimate.breakdown.labor },
    { label: 'Stellingen', range: estimate.breakdown.scaffolding },
    { label: 'Isolatie', range: estimate.breakdown.insulation },
  ]

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-slate-400">Kostenopbouw</h4>
      <div className="space-y-1">
        {breakdownItems.map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-slate-400">{item.label}</span>
            <span className="text-slate-300">{formatPriceRange(item.range[0], item.range[1])}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContractorCard({ contractor }: { contractor: Contractor }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-slate-100">{contractor.name}</h4>
          <p className="text-sm text-slate-400">{contractor.city}, {contractor.region}</p>
        </div>
        {contractor.verified && (
          <div className="rounded-full bg-emerald-500/10 border border-emerald-500/30 p-1.5">
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
        )}
      </div>

      {/* Rating */}
      {contractor.rating && (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(contractor.rating!) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
              }`}
            />
          ))}
          <span className="ml-1 text-sm text-slate-300">{contractor.rating}</span>
        </div>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {contractor.verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">
            <Check className="h-3 w-3" /> Geverifieerd
          </span>
        )}
        {contractor.financiallyHealthy && (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-xs text-sky-300">
            <TrendingUp className="h-3 w-3" /> Financieel gezond
          </span>
        )}
        {contractor.fullGuidancePremiums && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">
            <Building2 className="h-3 w-3" /> Premie-begeleiding
          </span>
        )}
      </div>

      {/* Stats */}
      {contractor.avgProjectsPerYear && (
        <p className="text-sm text-slate-400">
          {contractor.avgProjectsPerYear}+ projecten per jaar
        </p>
      )}

      {/* Description */}
      {contractor.notes && (
        <p className="text-sm text-slate-400 line-clamp-2">{contractor.notes}</p>
      )}

      {/* Contact Button */}
      <button className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400 transition-colors">
        Selecteer deze aannemer
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-slate-800 p-4 mb-4">
        <Building2 className="h-8 w-8 text-slate-500" />
      </div>
      <h3 className="text-lg font-medium text-slate-200 mb-2">
        Vul het formulier in
      </h3>
      <p className="text-sm text-slate-400 max-w-xs">
        Selecteer je projecttype en woningtype om een prijsindicatie en matchende aannemers te ontvangen.
      </p>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          <div className="h-10 bg-slate-700 rounded w-2/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-700 rounded w-1/3"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-slate-700 rounded-full w-20"></div>
              <div className="h-6 bg-slate-700 rounded-full w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function LeadFinderResults() {
  const { estimate, contractors, isEstimating, hasUsedCredit } = useLeadFinder()

  if (isEstimating) {
    return <LoadingState />
  }

  if (!hasUsedCredit || !estimate) {
    return <EmptyState />
  }

  return (
    <div className="space-y-4">
      {/* Price Estimate Card */}
      <div className="rounded-xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-slate-800/50 p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="rounded-full bg-sky-500/20 p-1.5">
            <Check className="h-4 w-4 text-sky-400" />
          </div>
          <h3 className="text-sm font-medium text-sky-300">Indicatieve prijsschatting</h3>
        </div>
        <div className="text-3xl font-bold text-slate-50 mb-1">
          {formatPriceRange(estimate.min, estimate.max)}
        </div>
        <p className="text-sm text-slate-400">
          Inclusief BTW, exclusief premies
        </p>
        <PriceBreakdown />
      </div>

      {/* Contractors */}
      {contractors.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300">
            {contractors.length} matchende aannemer{contractors.length > 1 ? 's' : ''}
          </h3>
          {contractors.map((contractor) => (
            <ContractorCard key={contractor.id} contractor={contractor} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-center">
          <p className="text-slate-400">
            Geen aannemers gevonden in jouw regio. Neem contact met ons op voor een persoonlijke match.
          </p>
        </div>
      )}
    </div>
  )
}
