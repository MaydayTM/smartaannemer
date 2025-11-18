import { Cpu, Play, RotateCcw, ZoomIn, Check } from 'lucide-react'

export function Hero3DViewer() {
  return (
    <div className="relative">
      <div className="relative rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-xl shadow-sky-500/10 overflow-hidden">
        {/* Fake toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400/70"></span>
            <span className="h-2 w-2 rounded-full bg-amber-300/70"></span>
            <span className="h-2 w-2 rounded-full bg-emerald-300/70"></span>
          </div>
          <div className="flex items-center gap-2 text-[0.65rem] md:text-xs text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-sky-300" />
            <span>AI 3D renovatiescan</span>
          </div>
        </div>

        {/* Main viewer area */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center">
          {/* House illustration placeholder */}
          <div className="relative w-[82%] max-w-md">
            <div className="absolute inset-0 bg-sky-500/15 blur-3xl rounded-full"></div>
            <div className="relative">
              <div className="rounded-xl border border-sky-400/60 bg-slate-900/80 p-4 shadow-lg shadow-sky-500/30">
                {/* Roof */}
                <div className="mx-auto w-3/4 h-5 md:h-6 bg-gradient-to-r from-slate-800 to-slate-700 rounded-t-md border-x border-t border-slate-600"></div>
                {/* House body */}
                <div className="mx-auto w-3/4 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-600 rounded-b-xl pt-6 pb-5 px-4 mt-0.5">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-2">
                      <div className="h-3 md:h-4 rounded bg-slate-700/80"></div>
                      <div className="h-3 md:h-4 rounded bg-slate-700/70"></div>
                      <div className="h-3 md:h-4 rounded bg-slate-700/60 w-3/4"></div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <div className="h-5 w-8 md:h-6 md:w-10 rounded bg-sky-500/40 border border-sky-400/30"></div>
                      <div className="h-5 w-8 md:h-6 md:w-10 rounded bg-emerald-500/30 border border-emerald-400/30"></div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    <div className="col-span-2 h-5 md:h-6 rounded bg-slate-700/70"></div>
                    <div className="h-5 md:h-6 rounded bg-slate-700/60"></div>
                    <div className="h-5 md:h-6 rounded bg-slate-700/60"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Viewer controls */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-slate-950/80 border border-slate-700/80 px-3 py-1.5 text-[0.65rem] md:text-xs text-slate-200 backdrop-blur">
            <button className="inline-flex items-center justify-center rounded-full bg-slate-800/80 border border-slate-600/80 p-1.5 hover:bg-slate-700/80 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button className="inline-flex items-center justify-center rounded-full bg-slate-800/80 border border-slate-600/80 p-1.5 hover:bg-slate-700/80 transition-colors">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button className="inline-flex items-center justify-center rounded-full bg-sky-500 text-slate-950 font-semibold px-2.5 py-1 text-[0.65rem] hover:bg-sky-400 transition-colors">
              <Play className="w-3 h-3 mr-1" />
              Bekijk renovatie
            </button>
          </div>

          {/* Overlay label */}
          <div className="absolute top-3 left-3 rounded-full bg-slate-950/90 border border-slate-700/80 px-3 py-1 text-[0.65rem] md:text-xs text-slate-100 flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/40">
              <Check className="w-3 h-3 text-emerald-300" />
            </span>
            <span>Deze tevreden klant vond zijn renovatiematch via deze tool.</span>
          </div>
        </div>
      </div>

      {/* Floating stats card */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 md:-right-4 md:left-auto md:translate-x-0 rounded-xl bg-slate-900/95 border border-slate-700 shadow-lg shadow-sky-500/20 px-4 py-3 flex items-center gap-4 backdrop-blur text-xs md:text-sm">
        <div className="flex flex-col">
          <span className="text-slate-400">Gemiddelde besparing</span>
          <span className="font-semibold tracking-tight text-emerald-300">tot €4.800</span>
          <span className="text-slate-500 text-[0.65rem] md:text-xs">met isolatie & zonnepanelen *</span>
        </div>
        <div className="h-10 w-px bg-slate-700 hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-emerald-500/15 border border-emerald-500/50 flex items-center justify-center">
            <Check className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-400 text-[0.65rem] md:text-xs">Aannemers geverifieerd</span>
            <span className="text-slate-100 text-xs md:text-sm">100+ projecten/jaar</span>
          </div>
        </div>
      </div>
    </div>
  )
}
