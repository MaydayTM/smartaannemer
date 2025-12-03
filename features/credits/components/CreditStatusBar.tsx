'use client'

import { Gift, Sparkles } from 'lucide-react'
import { useCredits } from '../context/CreditContext'

export function CreditStatusBar() {
  const { creditsTotal, creditsUsed, canUseCredit, isLoading } = useCredits()

  const creditsRemaining = creditsTotal - creditsUsed

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-slate-800/50 border border-slate-700 px-3 py-1.5 text-xs">
        <div className="h-4 w-4 animate-pulse rounded-full bg-slate-600" />
        <span className="text-slate-400">Laden...</span>
      </div>
    )
  }

  if (canUseCredit) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs">
        <Gift className="h-4 w-4 text-emerald-400" />
        <span className="text-emerald-300">
          {creditsRemaining}/{creditsTotal} gratis krediet beschikbaar
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs">
      <Sparkles className="h-4 w-4 text-amber-400" />
      <span className="text-amber-300">
        Gratis krediet opgebruikt
      </span>
      <button className="ml-1 text-amber-200 hover:text-amber-100 underline underline-offset-2">
        Ontdek meer credits
      </button>
    </div>
  )
}
