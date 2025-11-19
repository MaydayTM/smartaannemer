'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 py-3 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-sky-500/10 border border-sky-500/50 text-sky-300 text-xs tracking-tight font-semibold h-8 w-8 flex items-center justify-center">
            S
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm md:text-base tracking-tight font-semibold text-slate-50">
              SmartAannemer
            </span>
            <span className="text-xs md:text-sm text-slate-400">
              Renovatie & energie-upgrade
            </span>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm md:text-base">
          <a href="#how" className="text-slate-300 hover:text-slate-50 transition-colors">
            Hoe het werkt
          </a>
          <a href="#quality" className="text-slate-300 hover:text-slate-50 transition-colors">
            Kwaliteitslabel
          </a>
          <a href="#reviews" className="text-slate-300 hover:text-slate-50 transition-colors">
            Reviews
          </a>
          <a href="#tool" className="text-slate-300 hover:text-slate-50 transition-colors">
            Tool
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="hidden md:inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-1.5 text-xs md:text-sm text-slate-100 hover:border-slate-500 hover:bg-slate-900 transition-colors">
            <span>Log in</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 p-2 text-slate-100 hover:border-slate-500 hover:bg-slate-900 transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95">
          <nav className="flex flex-col px-4 py-3 text-sm">
            <a
              href="#how"
              className="py-2 text-slate-200 hover:text-sky-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hoe het werkt
            </a>
            <a
              href="#quality"
              className="py-2 text-slate-200 hover:text-sky-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kwaliteitslabel
            </a>
            <a
              href="#reviews"
              className="py-2 text-slate-200 hover:text-sky-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reviews
            </a>
            <a
              href="#tool"
              className="py-2 text-slate-200 hover:text-sky-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tool
            </a>
            <button className="mt-2 inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs text-slate-100 hover:border-slate-500 hover:bg-slate-900 transition-colors">
              Log in
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
