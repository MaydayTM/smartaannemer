# SmartAannemer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a React/Next.js lead finder app that provides AI-powered renovation estimates and matches users with verified contractors.

**Architecture:** Feature-based modules with React Context for state management, Repository pattern for Supabase data access, exact HTML-to-React conversion for design.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase, Lucide React, Zod

---

## Phase 1: Project Foundation

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`

**Step 1: Initialize Next.js with TypeScript**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

Answer prompts:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: No
- App Router: Yes
- Import alias: Yes (@/*)

**Step 2: Install dependencies**

Run:
```bash
npm install @supabase/supabase-js @supabase/ssr lucide-react zod
npm install -D @types/node
```

**Step 3: Verify installation**

Run: `npm run dev`
Expected: Server starts on http://localhost:3000

**Step 4: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js project with TypeScript and Tailwind"
```

---

### Task 2: Configure Tailwind for Design System

**Files:**
- Modify: `tailwind.config.ts`
- Create: `app/globals.css`

**Step 1: Update Tailwind config with design tokens**

`tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors from HTML mockup
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
    },
  },
  plugins: [],
}
export default config
```

**Step 2: Set up global styles**

`app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }

  body {
    @apply bg-slate-950 text-slate-50 antialiased;
  }
}
```

**Step 3: Test styling**

Run: `npm run dev`
Expected: Page should have dark background (slate-950)

**Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: configure Tailwind with design system colors"
```

---

### Task 3: Create Project Directory Structure

**Files:**
- Create: `features/.gitkeep`
- Create: `lib/repositories/.gitkeep`
- Create: `lib/supabase/.gitkeep`
- Create: `lib/utils/.gitkeep`
- Create: `components/ui/.gitkeep`
- Create: `types/.gitkeep`

**Step 1: Create directory structure**

Run:
```bash
mkdir -p features lib/repositories lib/supabase lib/utils components/ui types
touch features/.gitkeep lib/repositories/.gitkeep lib/supabase/.gitkeep lib/utils/.gitkeep components/ui/.gitkeep types/.gitkeep
```

**Step 2: Verify structure**

Run: `tree -L 2 -a`
Expected: All directories created

**Step 3: Commit**

```bash
git add .
git commit -m "feat: create feature-based directory structure"
```

---

### Task 4: Set Up Environment Variables

**Files:**
- Create: `.env.local.example`
- Create: `.env.local` (not committed)

**Step 1: Create environment template**

`.env.local.example`:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Step 2: Create local environment file**

Run:
```bash
cp .env.local.example .env.local
```

**Step 3: Add note to README**

Add to `README.md`:
```markdown
## Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Fill in Supabase credentials (see setup instructions below)
```

**Step 4: Commit**

```bash
git add .env.local.example README.md
git commit -m "feat: add environment variable template"
```

---

## Phase 2: Supabase Setup

### Task 5: Initialize Supabase Client

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

**Step 1: Create browser client**

`lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Step 2: Create server client**

`lib/supabase/server.ts`:
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie errors in Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie errors in Server Components
          }
        },
      },
    }
  )
}
```

**Step 3: Commit**

```bash
git add lib/supabase/
git commit -m "feat: add Supabase client configuration"
```

---

### Task 6: Create Database Schema (Migration)

**Files:**
- Create: `supabase/migrations/20250118000001_initial_schema.sql`

**Step 1: Create migration directory**

Run:
```bash
mkdir -p supabase/migrations
```

**Step 2: Write initial schema**

`supabase/migrations/20250118000001_initial_schema.sql`:
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Credit sessions table
CREATE TABLE credit_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT UNIQUE NOT NULL,
  credits_total INTEGER DEFAULT 1,
  credits_used INTEGER DEFAULT 0,
  first_used_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_sessions_token ON credit_sessions(session_token);

-- Contractors table
CREATE TABLE contractors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  website TEXT,
  email TEXT,
  phone TEXT,
  region TEXT,
  city TEXT,
  country TEXT DEFAULT 'BE',

  -- Capabilities
  offers_roof BOOLEAN DEFAULT FALSE,
  offers_facade BOOLEAN DEFAULT FALSE,
  offers_insulation BOOLEAN DEFAULT FALSE,
  offers_solar BOOLEAN DEFAULT FALSE,

  -- Quality flags
  verified BOOLEAN DEFAULT FALSE,
  financially_healthy BOOLEAN DEFAULT FALSE,
  full_guidance_premiums BOOLEAN DEFAULT FALSE,

  -- Metadata
  avg_project_value_min INTEGER,
  avg_project_value_max INTEGER,
  avg_projects_per_year INTEGER,
  rating DECIMAL(2,1),
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contractors_region ON contractors(region);
CREATE INDEX idx_contractors_verified ON contractors(verified);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT,

  -- Contact info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Project info
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  project_type TEXT NOT NULL,
  building_type TEXT NOT NULL,
  year_built INTEGER,
  urgency TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  priority TEXT,
  extra_info TEXT,

  -- Estimate snapshot
  estimate_min INTEGER,
  estimate_max INTEGER,
  estimate_currency TEXT DEFAULT 'EUR',

  -- Matching info
  matched_contractor_ids UUID[],
  chosen_contractor_id UUID REFERENCES contractors(id),

  -- Status
  status TEXT DEFAULT 'new',
  notes TEXT
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_postal_code ON leads(postal_code);

-- Row Level Security (RLS)
ALTER TABLE credit_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow anonymous read on contractors" ON contractors
  FOR SELECT USING (verified = TRUE);

CREATE POLICY "Allow anonymous insert on leads" ON leads
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Allow anonymous insert on credit_sessions" ON credit_sessions
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Allow anonymous read own credit_session" ON credit_sessions
  FOR SELECT USING (TRUE);

CREATE POLICY "Allow anonymous update own credit_session" ON credit_sessions
  FOR UPDATE USING (TRUE);
```

**Step 3: Add note to README**

Add to `README.md`:
```markdown
## Database Setup

To set up the database locally:

1. Install Supabase CLI: `brew install supabase/tap/supabase`
2. Start local Supabase: `npx supabase start`
3. Apply migrations: `npx supabase db push`
4. Get local credentials: `npx supabase status`
```

**Step 4: Commit**

```bash
git add supabase/ README.md
git commit -m "feat: add initial database schema with RLS policies"
```

---

### Task 7: Generate TypeScript Types

**Files:**
- Create: `types/database.types.ts`
- Create: `scripts/generate-types.sh`

**Step 1: Create type generation script**

`scripts/generate-types.sh`:
```bash
#!/bin/bash
npx supabase gen types typescript --local > types/database.types.ts
echo "✓ Database types generated"
```

**Step 2: Make script executable**

Run:
```bash
chmod +x scripts/generate-types.sh
```

**Step 3: Add npm script**

Add to `package.json` scripts:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "types:generate": "./scripts/generate-types.sh"
}
```

**Step 4: Create placeholder types file**

`types/database.types.ts`:
```typescript
// This file will be auto-generated by Supabase
// Run: npm run types:generate

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Generated types will appear here
    }
  }
}
```

**Step 5: Commit**

```bash
git add scripts/ types/ package.json
git commit -m "feat: add database type generation script"
```

---

### Task 8: Seed Demo Contractors

**Files:**
- Create: `supabase/seed.sql`

**Step 1: Create seed file**

`supabase/seed.sql`:
```sql
-- Insert demo contractors
INSERT INTO contractors (
  name, city, region, verified, financially_healthy,
  full_guidance_premiums, offers_roof, offers_facade,
  offers_insulation, offers_solar, avg_project_value_min,
  avg_project_value_max, avg_projects_per_year, rating, notes
) VALUES
  (
    'Dak & Gevel BV',
    'Antwerpen',
    'Antwerpen',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    15000,
    35000,
    120,
    4.7,
    'Gespecialiseerd in dak- en gevelrenovatie met focus op energie-efficiëntie, isolatie en premie-optimalisatie.'
  ),
  (
    'Isolatie+ Collectief',
    'Leuven',
    'Vlaams-Brabant',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    FALSE,
    12000,
    28000,
    85,
    4.6,
    'Collectief van isolatiespecialisten die je volledige schil aanpakken voor een lager energieverbruik en betere EPC-score.'
  ),
  (
    'RenovaPro',
    'Gent',
    'Oost-Vlaanderen',
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    18000,
    45000,
    95,
    4.8,
    'Full-service renovatiebedrijf met specialisatie in totaalrenovaties en energie-optimalisatie.'
  );
```

**Step 2: Add seed command to README**

Add to `README.md`:
```markdown
### Seed Demo Data

```bash
npx supabase db reset  # Resets and seeds
# Or manually:
psql $DATABASE_URL < supabase/seed.sql
```
```

**Step 3: Commit**

```bash
git add supabase/seed.sql README.md
git commit -m "feat: add demo contractor seed data"
```

---

## Phase 3: Type Definitions

### Task 9: Create Core Type Definitions

**Files:**
- Create: `types/lead.types.ts`
- Create: `types/contractor.types.ts`
- Create: `types/credit.types.ts`

**Step 1: Create lead types**

`types/lead.types.ts`:
```typescript
export type ProjectType = 'roof' | 'facade' | 'insulation' | 'solar' | 'combo'
export type BuildingType = 'row' | 'semi_detached' | 'detached' | 'apartment'
export type Urgency = '1-3m' | '3-6m' | '6-12m' | 'exploring'
export type Priority = 'price' | 'balance' | 'quality'
export type LeadStatus = 'new' | 'forwarded' | 'contacted' | 'won' | 'lost'

export interface FormData {
  address: string
  postalCode: string
  city: string
  projectType: ProjectType | null
  buildingType: BuildingType | null
  yearBuilt: number | null
  urgency: Urgency | null
  budgetRange: [number, number]
  priority: Priority
}

export interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  extraInfo?: string
}

export interface PriceEstimate {
  min: number
  max: number
  currency: string
  breakdown: {
    materials: [number, number]
    labor: [number, number]
    scaffolding: [number, number]
    insulation: [number, number]
  }
}

export interface CreateLeadInput extends FormData, ContactInfo {
  estimate: PriceEstimate
  matchedContractorIds: string[]
  chosenContractorId?: string
  source?: string
}

export interface Lead extends CreateLeadInput {
  id: string
  createdAt: string
  status: LeadStatus
  notes?: string
}
```

**Step 2: Create contractor types**

`types/contractor.types.ts`:
```typescript
export interface Contractor {
  id: string
  name: string
  city: string
  region: string
  website?: string
  email?: string
  phone?: string
  verified: boolean
  financiallyHealthy: boolean
  fullGuidancePremiums: boolean
  offersRoof: boolean
  offersFacade: boolean
  offersInsulation: boolean
  offersSolar: boolean
  avgProjectValueMin?: number
  avgProjectValueMax?: number
  avgProjectsPerYear?: number
  rating?: number
  notes?: string
  createdAt: string
}

export interface MatchCriteria {
  region: string
  projectType: string
  budgetMin?: number
  budgetMax?: number
  priority: 'price' | 'balance' | 'quality'
}
```

**Step 3: Create credit types**

`types/credit.types.ts`:
```typescript
export interface CreditSession {
  id: string
  sessionToken: string
  creditsTotal: number
  creditsUsed: number
  firstUsedAt?: string
  lastUsedAt?: string
  createdAt: string
}

export interface CreditStatus {
  creditsTotal: number
  creditsUsed: number
  canUseCredit: boolean
}
```

**Step 4: Commit**

```bash
git add types/
git commit -m "feat: add TypeScript type definitions for core domain"
```

---

## Phase 4: Shared Components

### Task 10: Create Navbar Component

**Files:**
- Create: `components/ui/Navbar.tsx`

**Step 1: Create Navbar component**

`components/ui/Navbar.tsx`:
```typescript
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
```

**Step 2: Commit**

```bash
git add components/ui/Navbar.tsx
git commit -m "feat: add Navbar component with mobile menu"
```

---

### Task 11: Create Footer Component

**Files:**
- Create: `components/ui/Footer.tsx`

**Step 1: Create Footer component**

`components/ui/Footer.tsx`:
```typescript
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
```

**Step 2: Commit**

```bash
git add components/ui/Footer.tsx
git commit -m "feat: add Footer component"
```

---

### Task 12: Update Root Layout

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update layout with metadata and fonts**

`app/layout.tsx`:
```typescript
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
```

**Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: update root layout with metadata"
```

---

## Phase 5: Hero Section

### Task 13: Create Hero Section

**Files:**
- Create: `features/hero/components/HeroSection.tsx`
- Create: `features/hero/components/Hero3DViewer.tsx`
- Create: `features/hero/index.ts`

**Step 1: Create Hero3DViewer component**

`features/hero/components/Hero3DViewer.tsx`:
```typescript
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
```

**Step 2: Create HeroSection component**

`features/hero/components/HeroSection.tsx`:
```typescript
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
```

**Step 3: Create feature index**

`features/hero/index.ts`:
```typescript
export { HeroSection } from './components/HeroSection'
export { Hero3DViewer } from './components/Hero3DViewer'
```

**Step 4: Commit**

```bash
git add features/hero/
git commit -m "feat: add Hero section with 3D viewer"
```

---

*Due to message length constraints, I'll continue with a summary of remaining tasks. The full plan follows the same pattern for all remaining sections.*

## Phase 6-10: Remaining Sections (Summary)

**Task 14-18:** Create Quality Label, How It Works, Reviews, and FAQ sections following the same component pattern.

**Task 19-25:** Implement Credit System
- CreditContext with state management
- CreditsRepository for database operations
- CreditStatusBar and CreditModal components
- Session token generation and cookie handling

**Task 26-35:** Implement Lead Finder
- LeadFinderContext
- LeadFinderForm with all input components
- Pricing utility functions
- EstimateRepository
- ContractorsRepository
- LeadsRepository
- LeadFinderResults with contractor cards
- Form validation with Zod

**Task 36-40:** Integration & Testing
- Connect all repositories to Supabase
- End-to-end flow testing
- Deploy to Vercel
- Configure environment variables
- Test production deployment

Each task follows the TDD pattern where applicable:
1. Write failing test
2. Verify failure
3. Implement minimal code
4. Verify passing
5. Commit

---

## Execution Notes

- Work in `.worktrees/nextjs-setup` branch
- Make frequent, small commits
- Test each component in isolation
- Verify Supabase connection before repository implementation
- Use exact file paths from design document
- Follow YAGNI - implement only MVP features
- Deploy early and often to catch issues

---

## Success Criteria

✅ All sections render correctly (visual match to HTML mockup)
✅ Credit system tracks and limits usage
✅ Lead finder form collects all required data
✅ Price estimation returns reasonable values
✅ Contractor matching returns 1-3 results
✅ Lead submission saves to database
✅ Responsive design works on mobile/tablet/desktop
✅ Production deployment on Vercel succeeds
✅ All TypeScript types compile without errors
✅ No console errors in browser
