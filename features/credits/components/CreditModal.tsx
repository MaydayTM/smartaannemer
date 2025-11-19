'use client'

import { X, AlertCircle, Mail } from 'lucide-react'

interface CreditModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreditModal({ isOpen, onClose }: CreditModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-slate-950/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30">
              <AlertCircle className="w-4 h-4 text-amber-300" />
            </div>
            <h2 className="text-lg font-semibold text-slate-50">
              Krediet opgebruikt
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
            aria-label="Sluit modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-slate-300">
            Je hebt je <span className="font-semibold text-slate-50">gratis krediet</span> al
            gebruikt. Wil je meer offertes ontvangen?
          </p>

          <div className="rounded-xl bg-slate-950/50 border border-slate-800 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-50">
              Krijg meer credits
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Onbeperkte offertes voor jouw projecten</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Matches met méér kwaliteitsaannemers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Prioritaire ondersteuning</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-slate-500">
            Neem contact met ons op voor meer informatie over beschikbare pakketten.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-colors"
          >
            Sluiten
          </button>
          <a
            href="mailto:info@smartaannemer.be?subject=Meer%20credits%20aanvragen"
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
          >
            <Mail className="w-4 h-4" />
            <span>Contacteer ons</span>
          </a>
        </div>
      </div>
    </div>
  )
}
