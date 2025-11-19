import { Sparkles, ArrowRight, Gift, ShieldCheck, Home, CheckCircle2, Award } from 'lucide-react'
import { Hero3DViewer } from './Hero3DViewer'

export function HeroSection() {
  return (
    <section className="border-b border-slate-900 bg-gradient-to-b from-slate-950 to-slate-950/90">
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-12 md:pt-16 md:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Hero copy */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-3 py-1 text-xs md:text-sm text-sky-200">
            <Sparkles className="w-4 h-4" />
            <span>AI-gestuurde renovatie & energietool</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-50">
            Vind de juiste aannemer voor jouw renovatie in 60 seconden
          </h1>

          <p className="text-base md:text-lg text-slate-300">
            Vul je adres in, gebruik je <span className="font-semibold text-sky-200">gratis krediet</span> en krijg een indicatieve offerte plus een match met een bewezen bouwpartner voor dak-, gevel-, isolatie- of zonneprojecten.
          </p>

          <div className="space-y-3">
            <a
              href="#tool"
              className="inline-flex items-center justify-center rounded-full bg-amber-400 text-slate-950 text-sm md:text-base font-semibold tracking-tight px-6 py-2.5 shadow-lg shadow-amber-400/30 hover:bg-amber-300 transition-colors"
            >
              Gebruik mijn gratis krediet
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a
              href="#how"
              className="block text-xs md:text-sm text-slate-300 hover:text-sky-200 underline-offset-4 hover:underline"
            >
              Bekijk eerst hoe het werkt
            </a>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1 text-xs md:text-sm text-slate-100">
              <Gift className="w-3.5 h-3.5 text-amber-300" />
              <span>1 gratis krediet</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1 text-xs md:text-sm text-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Geselecteerde kwaliteitsbedrijven</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1 text-xs md:text-sm text-slate-100">
              <Home className="w-3.5 h-3.5 text-sky-300" />
              <span>Dak, gevel, isolatie & zonnepanelen</span>
            </div>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs md:text-sm text-slate-400">
            <div className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Alle aannemers vooraf gescreend</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-sky-300" />
              <span>Focus op Belgische renovatiepremies</span>
            </div>
          </div>
        </div>

        {/* Hero 3D viewer */}
        <Hero3DViewer />
      </div>
    </section>
  )
}
