export function Footer() {
  return (
    <footer className="bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-slate-900">
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400">
          <span className="text-slate-200 font-semibold tracking-tight">SmartAannemer</span>
          <span className="h-1 w-1 rounded-full bg-slate-600"></span>
          <span>Lead finder voor renovatieprojecten.</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-400">
          <a href="#" className="hover:text-slate-200">Over ons</a>
          <a href="#" className="hover:text-slate-200">Privacyverklaring</a>
          <a href="#" className="hover:text-slate-200">Algemene voorwaarden</a>
          <a href="#" className="hover:text-slate-200">Contact</a>
        </div>
      </div>
    </footer>
  )
}
