import { MapPin, Sparkles, Users, CheckCircle2 } from 'lucide-react'

export function HowItWorksSection() {
  return (
    <section id="how" className="border-b border-slate-900 bg-gradient-to-b from-slate-950 to-slate-950/95">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-3 py-1 text-xs md:text-sm text-sky-200 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Zo eenvoudig werkt het</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-50 mb-4">
            Van adres tot offerte in 60 seconden
          </h2>
          <p className="text-base md:text-lg text-slate-300">
            Ons AI-systeem analyseert je project en matcht je direct met de beste aannemers in jouw regio.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

          {/* Step 1 */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-sky-500/50 transition-all hover:shadow-lg hover:shadow-sky-500/10">
              <div className="inline-flex items-center justify-center rounded-full bg-sky-500 text-slate-950 font-bold text-xl w-12 h-12 mb-4 relative z-10">
                1
              </div>
              <div className="rounded-lg bg-sky-500/10 border border-sky-500/20 w-12 h-12 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-sky-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">
                Vul je adres in
              </h3>
              <p className="text-sm text-slate-400">
                Geef je adres en projecttype op. Ons systeem haalt automatisch bouwjaar en kadastergegevens op.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10">
              <div className="inline-flex items-center justify-center rounded-full bg-amber-400 text-slate-950 font-bold text-xl w-12 h-12 mb-4 relative z-10">
                2
              </div>
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 w-12 h-12 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">
                AI-berekening
              </h3>
              <p className="text-sm text-slate-400">
                Onze AI analyseert je project en berekent een indicatieve offerte op basis van marktprijzen.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="inline-flex items-center justify-center rounded-full bg-emerald-400 text-slate-950 font-bold text-xl w-12 h-12 mb-4 relative z-10">
                3
              </div>
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">
                Match met aannemers
              </h3>
              <p className="text-sm text-slate-400">
                We matchen je met 1-3 gescreende aannemers die gespecialiseerd zijn in jouw type project.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10">
              <div className="inline-flex items-center justify-center rounded-full bg-purple-400 text-slate-950 font-bold text-xl w-12 h-12 mb-4 relative z-10">
                4
              </div>
              <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 w-12 h-12 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-50 mb-2">
                Ontvang offertes
              </h3>
              <p className="text-sm text-slate-400">
                De geselecteerde aannemers nemen binnen 48 uur contact met je op voor een gratis plaatsbezoek.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="#tool"
            className="inline-flex items-center justify-center rounded-full bg-sky-500 text-slate-950 text-sm md:text-base font-semibold tracking-tight px-8 py-3 shadow-lg shadow-sky-500/30 hover:bg-sky-400 transition-colors"
          >
            Probeer het nu gratis
          </a>
        </div>
      </div>
    </section>
  )
}
