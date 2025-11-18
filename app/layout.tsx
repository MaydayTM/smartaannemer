import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SmartAannemer – Vind de juiste aannemer voor jouw renovatie',
  description: 'Vind in 60 seconden de juiste aannemer voor jouw dak-, gevel-, isolatie- of zonneproject. AI-gestuurde offerte en match met gescreende kwaliteitsbedrijven.',
  keywords: ['renovatie', 'aannemer', 'dak', 'gevel', 'isolatie', 'zonnepanelen', 'België'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
