'use client'

import { useCreditContext } from '../context/CreditContext'
import { Gift, Loader2 } from 'lucide-react'

export function CreditStatusBar() {
  const { creditsTotal, creditsUsed, canUseCredit, isLoading } = useCreditContext()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Laden...</span>
      </div>
    )
  }

  const creditsRemaining = creditsTotal - creditsUsed

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
        canUseCredit
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
          : 'border-slate-700 bg-slate-900/80 text-slate-400'
      }`}
    >
      <Gift className={`w-4 h-4 ${canUseCredit ? 'text-amber-300' : 'text-slate-500'}`} />
      <span>
        {canUseCredit ? (
          <>
            <span className="font-semibold">{creditsRemaining}/{creditsTotal}</span> gratis krediet beschikbaar
          </>
        ) : (
          <>Geen credits beschikbaar</>
        )}
      </span>
    </div>
  )
}
