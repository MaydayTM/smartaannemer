import { Star, Quote } from 'lucide-react'

export function ReviewsSection() {
  const reviews = [
    {
      name: 'Sofie D.',
      location: 'Antwerpen',
      rating: 5,
      project: 'Dakrenovatie',
      quote: 'Binnen 2 dagen had ik 3 offertes van kwaliteitsaannemers. De premie-begeleiding heeft me €3.200 bespaard. Super tevreden!',
      savings: '€3.200'
    },
    {
      name: 'Marc V.',
      location: 'Gent',
      rating: 5,
      project: 'Gevelisolatie + Zonnepanelen',
      quote: 'De AI-schatting was verrassend accuraat. De aannemer die ik gekozen heb deed exact wat beloofd was. Aanrader!',
      savings: '€4.800'
    },
    {
      name: 'Lisa M.',
      location: 'Leuven',
      rating: 5,
      project: 'Spouwmuurisolatie',
      quote: 'Gratis krediet gebruikt en meteen een goede match gevonden. Project afgerond binnen 3 weken. Heel blij met het resultaat.',
      savings: '€2.400'
    }
  ]

  return (
    <section id="reviews" className="border-b border-slate-900 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs md:text-sm text-amber-200 mb-4">
            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>4.7/5 gemiddelde beoordeling</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-50 mb-4">
            Wat klanten zeggen
          </h2>
          <p className="text-base md:text-lg text-slate-300">
            Honderden tevreden huiseigenaren vonden al hun ideale aannemer via SmartAannemer.
          </p>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-slate-700/20"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-slate-700" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed">
                "{review.quote}"
              </p>

              {/* Author info */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <div className="font-semibold text-slate-50 text-sm">{review.name}</div>
                  <div className="text-xs text-slate-500">{review.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-0.5">{review.project}</div>
                  <div className="text-sm font-semibold text-emerald-300">
                    {review.savings} bespaard
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-slate-50 mb-1">500+</div>
            <div className="text-sm text-slate-400">Tevreden klanten</div>
          </div>
          <div className="h-12 w-px bg-slate-800 hidden sm:block"></div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-slate-50 mb-1">4.7/5</div>
            <div className="text-sm text-slate-400">Gemiddelde score</div>
          </div>
          <div className="h-12 w-px bg-slate-800 hidden sm:block"></div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-slate-50 mb-1">€3.5k</div>
            <div className="text-sm text-slate-400">Gem. premiebesparing</div>
          </div>
        </div>
      </div>
    </section>
  )
}
