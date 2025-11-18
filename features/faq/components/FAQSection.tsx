'use client'

import { HelpCircle, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'Hoe werkt het gratis krediet?',
      answer: 'Bij je eerste bezoek krijg je automatisch 1 gratis krediet. Dit krediet gebruik je om een AI-gestuurde prijsschatting te krijgen en gematcht te worden met 1-3 aannemers. Na gebruik van je gratis krediet, kun je credits bijkopen voor meer projecten.'
    },
    {
      question: 'Hoe accuraat is de AI-prijsschatting?',
      answer: 'Onze AI analyseert duizenden voltooide projecten en houdt rekening met je specifieke situatie (type woning, bouwjaar, regio, projectomvang). De schatting heeft een nauwkeurigheid van ±15% en geeft je een goed startpunt voor budgettering.'
    },
    {
      question: 'Zijn de aannemers echt gescreend?',
      answer: 'Ja, absoluut. We controleren elke aannemer op: financiële gezondheid (via Graydon), ervaring (min. 100 projecten/jaar), verzekeringen, kwaliteitscertificaten, en klanttevredenheid (min. 4.5/5). Alleen aannemers die aan alle criteria voldoen komen in ons netwerk.'
    },
    {
      question: 'Moet ik betalen voor de offertes van aannemers?',
      answer: 'Nee, de offertes en plaatsbezoeken van de aannemers zijn volledig gratis. Je betaalt alleen voor het gebruik van ons matching-platform (1 gratis krediet bij aanmelding).'
    },
    {
      question: 'Hoe zit het met renovatiepremies?',
      answer: 'Alle aannemers in ons netwerk zijn gespecialiseerd in het begeleiden van premie-aanvragen voor Vlaamse renovatiepremies (My Energy, Mijn VerbouwPremie). Ze helpen je met het correct invullen van aanvragen en zorgen dat je werk voldoet aan de technische eisen.'
    },
    {
      question: 'Hoelang duurt het voor ik een offerte ontvang?',
      answer: 'Na matching nemen de aannemers binnen 48 uur contact met je op om een plaatsbezoek in te plannen. De volledige offerte ontvang je doorgaans binnen 5-7 werkdagen na het plaatsbezoek.'
    },
    {
      question: 'Kan ik de tool ook gebruiken voor kleinere projecten?',
      answer: 'Ja, onze tool werkt voor projecten vanaf €5.000. Voor kleinere klusjes raden we aan rechtstreeks contact op te nemen met lokale aannemers.'
    },
    {
      question: 'Wat gebeurt er met mijn gegevens?',
      answer: 'Je gegevens worden uitsluitend gedeeld met de geselecteerde aannemers. We verkopen nooit data aan derden. Zie onze privacyverklaring voor meer details over gegevensverwerking.'
    }
  ]

  return (
    <section className="border-b border-slate-900 bg-gradient-to-b from-slate-950 to-slate-950/95">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1 text-xs md:text-sm text-purple-200 mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Veelgestelde vragen</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-50 mb-4">
            Alles wat je moet weten
          </h2>
          <p className="text-base md:text-lg text-slate-300">
            Vind snel antwoorden op de meest gestelde vragen over SmartAannemer.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden hover:border-slate-700 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-900/80 transition-colors"
              >
                <span className="font-semibold text-slate-50 text-sm md:text-base pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-sm md:text-base text-slate-400 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center p-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40">
          <h3 className="text-lg md:text-xl font-semibold text-slate-50 mb-2">
            Nog vragen?
          </h3>
          <p className="text-sm md:text-base text-slate-400 mb-4">
            Neem gerust contact met ons op via{' '}
            <a href="mailto:info@smartaannemer.be" className="text-sky-300 hover:text-sky-200 underline">
              info@smartaannemer.be
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
