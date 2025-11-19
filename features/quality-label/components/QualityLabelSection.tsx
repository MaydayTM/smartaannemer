import { ShieldCheck, FileCheck, TrendingUp, Users } from 'lucide-react'

export function QualityLabelSection() {
  return (
    <section id="quality" className="border-b border-slate-900 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs md:text-sm text-emerald-200 mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Kwaliteitsgarantie</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-50 mb-4">
            Alleen gescreende kwaliteitsbedrijven
          </h2>
          <p className="text-base md:text-lg text-slate-300">
            We werken uitsluitend met aannemers die vooraf gescreend zijn op financiële gezondheid,
            ervaring en klanttevredenheid.
          </p>
        </div>

        {/* Quality criteria grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Criterion 1 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-12 h-12 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Financieel gezond
            </h3>
            <p className="text-sm text-slate-400">
              Gecontroleerd op financiële stabiliteit om continuïteit van je project te garanderen.
            </p>
          </div>

          {/* Criterion 2 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors">
            <div className="rounded-lg bg-sky-500/10 border border-sky-500/20 w-12 h-12 flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6 text-sky-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Premie-expert
            </h3>
            <p className="text-sm text-slate-400">
              Volledige begeleiding bij aanvragen van Vlaamse renovatiepremies en subsidies.
            </p>
          </div>

          {/* Criterion 3 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors">
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 w-12 h-12 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-amber-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Bewezen ervaring
            </h3>
            <p className="text-sm text-slate-400">
              Minimaal 100 projecten per jaar met aantoonbare trackrecord in renovatie.
            </p>
          </div>

          {/* Criterion 4 */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors">
            <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 w-12 h-12 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Klanttevredenheid
            </h3>
            <p className="text-sm text-slate-400">
              Hoge beoordelingen van vorige klanten met minimaal 4.5/5 sterren gemiddeld.
            </p>
          </div>
        </div>

        {/* Stats banner */}
        <div className="mt-12 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-300 mb-2">100+</div>
              <div className="text-sm text-slate-400">Geverifieerde aannemers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-sky-300 mb-2">4.7/5</div>
              <div className="text-sm text-slate-400">Gemiddelde beoordeling</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">€4.8k</div>
              <div className="text-sm text-slate-400">Gemiddelde premiebesparing</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
