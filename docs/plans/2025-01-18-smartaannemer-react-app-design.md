# SmartAannemer React App Design

**Date:** January 18, 2025
**Author:** Architecture Review
**Status:** Approved

## Executive Summary

SmartAannemer converts a renovation lead finder from HTML mockup to Next.js App Router application. Users enter their address and project details, receive an AI-powered price estimate, and match with 1-3 verified contractors. Each user gets one free credit to use the tool.

## Core Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js (App Router) | React Server Components, built-in API routes, Vercel deployment |
| Architecture | Feature-Based Modules | Scales with features, clear boundaries, team-friendly |
| State Management | React Context + Hooks | No external dependencies, sufficient for app complexity |
| Data Layer | Repository Pattern | Abstracts Supabase, testable, database-agnostic |
| Design Approach | Exact HTML Replica | Fast to market, design already validated |
| Deployment | Vercel | Native Next.js hosting, zero-config, optimal performance |
| Database | Supabase | Postgres + auth + realtime, excellent Next.js integration |

## Project Structure

```
smartaannemer/
├── app/
│   ├── layout.tsx           # Root layout, fonts, metadata
│   ├── page.tsx             # Landing page assembly
│   └── globals.css          # Tailwind + custom styles
├── features/
│   ├── hero/
│   │   └── components/      # HeroSection, Hero3DViewer
│   ├── lead-finder/
│   │   ├── components/      # Form, results, contractor cards
│   │   ├── context/         # LeadFinderContext
│   │   ├── hooks/           # useLeadForm, useEstimate
│   │   └── types/           # TypeScript interfaces
│   ├── credits/
│   │   ├── components/      # CreditStatusBar, CreditModal
│   │   ├── context/         # CreditContext
│   │   └── hooks/           # useCredits
│   ├── contractors/
│   ├── reviews/
│   ├── quality-label/
│   └── faq/
├── lib/
│   ├── repositories/        # Data access layer
│   │   ├── LeadsRepository.ts
│   │   ├── ContractorsRepository.ts
│   │   └── CreditsRepository.ts
│   ├── supabase/
│   │   ├── client.ts        # Client configuration
│   │   └── types.ts         # Generated database types
│   └── utils/
│       └── pricing.ts       # Price calculation logic
├── components/
│   └── ui/                  # Shared components
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── Button.tsx
└── types/
    └── database.types.ts    # Supabase generated types
```

## Component Architecture

### Page Assembly

The landing page assembles sections in sequence:

```tsx
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <QualityLabelSection />
        <HowItWorksSection />
        <ReviewsSection />
        <LeadFinderSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
```

### Lead Finder Structure

The tool splits into three components:

1. **LeadFinderSection** - Container, provides context
2. **LeadFinderForm** - Left panel, collects user input
3. **LeadFinderResults** - Right panel, displays estimate and contractors

**LeadFinderForm** contains:
- AddressInput (autocomplete)
- ProjectTypePills (Dakrenovatie, Gevelrenovatie, Isolatie, Zonnepanelen, Combinatie)
- BuildingInfoInputs (year, type, urgency)
- BudgetSlider + PriorityToggle
- UseCreditButton

**LeadFinderResults** contains:
- LoadingState (skeleton animation)
- PriceEstimateCard (price range, breakdown)
- ContractorList (1-3 matches)
- LeadCaptureForm (contact info, consent)

### Styling

Extract Tailwind classes directly from HTML mockup. Use Lucide React for icons (replaces CDN version). Maintain exact visual design: slate-950 background, sky/amber accents, card-based layout.

## State Management

### CreditContext

Tracks credit status across the application:

```tsx
interface CreditState {
  creditsTotal: number        // Always 1 in MVP
  creditsUsed: number         // 0 or 1
  isLoading: boolean
  canUseCredit: boolean       // Derived: creditsUsed < creditsTotal
}

interface CreditActions {
  useCredit: () => Promise<void>
  refreshStatus: () => Promise<void>
}
```

### LeadFinderContext

Manages form state and results:

```tsx
interface LeadFinderState {
  // Form inputs
  address: string
  projectType: 'roof' | 'facade' | 'insulation' | 'solar' | 'combo' | null
  buildingType: 'row' | 'semi_detached' | 'detached' | 'apartment' | null
  yearBuilt: number | null
  urgency: '1-3m' | '3-6m' | '6-12m' | 'exploring' | null
  budgetRange: [number, number]
  priority: 'price' | 'balance' | 'quality'

  // Results
  estimate: PriceEstimate | null
  contractors: Contractor[]
  isEstimating: boolean
  error: string | null
}

interface LeadFinderActions {
  updateForm: (updates: Partial<FormData>) => void
  submitEstimate: () => Promise<void>
  submitLead: (contactInfo: ContactInfo) => Promise<void>
}
```

### Data Flow

1. User fills form → `updateForm()` updates context
2. User clicks "Gebruik krediet" → `submitEstimate()` executes
3. System checks `CreditContext.canUseCredit`
4. If false → shows error modal
5. If true → calls `CreditRepository.use()` + `EstimateRepository.create()` in parallel
6. Updates both contexts → UI re-renders with results
7. User selects contractor → fills form → `submitLead()` saves to database

## Repository Pattern

Repositories abstract all database operations. Each repository takes a Supabase client in its constructor.

### CreditsRepository

```tsx
class CreditsRepository {
  async getStatus(sessionToken: string): Promise<CreditStatus>
  async useCredit(sessionToken: string): Promise<void>
  async createSession(): Promise<string>
}
```

### LeadsRepository

```tsx
class LeadsRepository {
  async create(lead: CreateLeadInput): Promise<Lead>
  async updateStatus(leadId: string, status: LeadStatus): Promise<void>
}
```

### EstimateRepository

```tsx
class EstimateRepository {
  async create(input: EstimateInput): Promise<PriceEstimate>
}
```

Calculates price based on project type, building type, year built. Uses formulas in `lib/utils/pricing.ts`. Optionally calls AI for descriptive text.

### ContractorsRepository

```tsx
class ContractorsRepository {
  async match(criteria: MatchCriteria): Promise<Contractor[]>
}
```

Queries contractors table with filters:
- Region matches postal code
- `offers_{project_type}` equals true
- `verified` equals true
- Orders by fit score, returns top 1-3

## Credit System

### Session-Based Tracking (MVP)

**First visit:**
1. Check for `credit_session_token` cookie
2. If missing → call `CreditsRepository.createSession()`
3. Store token in httpOnly cookie
4. Insert row: `{ id, session_token, credits_total: 1, credits_used: 0 }`

**Page load:**
1. `CreditContext` calls `getStatus(token)` on mount
2. Updates UI: "1/1 gratis krediet beschikbaar"
3. Sets `canUseCredit: true`

**Using credit:**
1. User clicks "Gebruik mijn gratis krediet"
2. Call `CreditsRepository.useCredit(token)`
3. Database executes: `UPDATE credit_sessions SET credits_used = 1 WHERE session_token = ?`
4. Fetch estimate + contractors
5. Update UI: "0/1 gratis krediet beschikbaar"
6. Disable button, show "Gratis krediet opgebruikt"

**Credit exhausted:**
- `CreditStatusBar` switches from emerald to amber
- Tool inputs remain visible
- Submit button becomes disabled
- CTA changes to "Ontdek credits" → opens upgrade modal

### Database Schema

```sql
CREATE TABLE credit_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token text UNIQUE NOT NULL,
  credits_total int DEFAULT 1,
  credits_used int DEFAULT 0,
  first_used_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_credit_sessions_token ON credit_sessions(session_token);
```

### Future: User Accounts

When adding authentication:

```sql
CREATE TABLE user_credits (
  user_id uuid REFERENCES profiles(id),
  credits_total int,
  credits_used int,
  plan_type text
);
```

## Database Schema

### leads

```sql
CREATE TABLE leads (
  id uuid PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  source text,

  -- Contact info
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,

  -- Project info
  address text NOT NULL,
  postal_code text NOT NULL,
  city text NOT NULL,
  project_type text NOT NULL,
  building_type text NOT NULL,
  year_built int,
  urgency text,
  budget_min int,
  budget_max int,

  -- Estimate snapshot
  estimate_min int,
  estimate_max int,
  estimate_currency text DEFAULT 'EUR',

  -- Matching info
  matched_contractor_ids uuid[],
  chosen_contractor_id uuid,

  -- Status
  status text DEFAULT 'new',
  notes text
);
```

### contractors

```sql
CREATE TABLE contractors (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  website text,
  email text,
  phone text,
  region text,
  city text,
  country text DEFAULT 'BE',

  -- Capabilities
  offers_roof boolean DEFAULT false,
  offers_facade boolean DEFAULT false,
  offers_insulation boolean DEFAULT false,
  offers_solar boolean DEFAULT false,

  -- Quality flags
  verified boolean DEFAULT false,
  financially_healthy boolean DEFAULT false,
  full_guidance_premiums boolean DEFAULT false,

  -- Metadata
  avg_project_value_min int,
  avg_project_value_max int,
  notes text
);
```

## Type Safety

### Supabase Type Generation

```bash
npx supabase gen types typescript --project-id <ref> > types/database.types.ts
```

Run this command after schema changes. Provides type-safe queries.

### Feature Types

```tsx
// features/lead-finder/types/lead.types.ts
export type ProjectType = 'roof' | 'facade' | 'insulation' | 'solar' | 'combo'
export type BuildingType = 'row' | 'semi_detached' | 'detached' | 'apartment'
export type Urgency = '1-3m' | '3-6m' | '6-12m' | 'exploring'
export type Priority = 'price' | 'balance' | 'quality'

export interface FormData {
  address: string
  postalCode: string
  city: string
  projectType: ProjectType
  buildingType: BuildingType
  yearBuilt: number
  urgency: Urgency
  budgetRange: [number, number]
  priority: Priority
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

export interface Contractor {
  id: string
  name: string
  city: string
  region: string
  verified: boolean
  score: number
  description: string
  avgProjectsPerYear: number
  rating: number
  badges: string[]
}
```

## Environment Configuration

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

`NEXT_PUBLIC_*` variables expose to browser. `SUPABASE_SERVICE_ROLE_KEY` remains server-only for admin operations.

## Development Workflow

1. Start Supabase locally: `npx supabase start`
2. Apply migrations: `npx supabase db push`
3. Generate types: `npx supabase gen types typescript`
4. Run Next.js: `npm run dev`
5. Access app: `http://localhost:3000`

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.0.10",
    "lucide-react": "^0.300.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## Testing Strategy (Future)

- **Unit tests:** Repository classes with mocked Supabase client
- **Integration tests:** API routes with test database
- **E2E tests:** Playwright for critical paths (credit → estimate → lead)

## MVP Scope

### Included

- Landing page with all sections (hero, quality, how-it-works, reviews, FAQ)
- Lead finder tool with credit system
- Price estimation (formula-based)
- Contractor matching (database query)
- Lead capture and storage
- Session-based credit tracking
- Responsive design (mobile, tablet, desktop)

### Excluded (Post-MVP)

- User authentication and accounts
- User dashboard with saved projects
- Contractor dashboard
- Payment system for additional credits
- AI-powered price descriptions
- Real geo/roof surface area calculation
- Advanced analytics
- Email notifications
- Admin panel

## Security Considerations

- Session tokens use cryptographically random UUIDs
- Store tokens in httpOnly cookies (prevents XSS)
- Validate credits server-side (prevents manipulation)
- Rate limit session creation (prevents abuse)
- Supabase Row Level Security (RLS) for data access
- Input validation with Zod schemas
- SQL injection protection via Supabase parameterized queries

## Performance Targets

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Estimate generation: < 5s
- Contractor matching: < 2s

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators on interactive elements
- Color contrast meets WCAG AA standards
- Screen reader tested

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Next Steps

1. Initialize Next.js project with TypeScript
2. Set up Supabase project and local development
3. Create database schema and migrations
4. Build project structure (features, lib, components)
5. Convert HTML to React components (start with Navbar, Hero, Footer)
6. Implement credit system (context, repository, UI)
7. Build lead finder form (inputs, validation)
8. Implement estimate calculation
9. Build contractor matching
10. Create lead capture flow
11. Test end-to-end flow
12. Deploy to Vercel
