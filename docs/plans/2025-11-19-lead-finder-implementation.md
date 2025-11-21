# Lead Finder Tool Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the interactive Lead Finder tool that collects user input, calculates renovation estimates, matches contractors, and saves leads to the database.

**Architecture:** Feature-based architecture with LeadFinderContext for state management, Repository pattern for data access, form validation with Zod, step-by-step wizard UI.

**Tech Stack:** Next.js 14 App Router, React Context, TypeScript, Zod, Supabase, Tailwind CSS

---

## Phase 6: Lead Finder Tool

### Task 19: Create Pricing Utility Functions

**Files:**
- Create: `lib/utils/pricing.ts`

**Step 1: Create pricing utility with estimate calculation**

`lib/utils/pricing.ts`:
```typescript
import type { ProjectType, BuildingType, PriceEstimate } from '@/types/lead.types'

/**
 * Calculate price estimate based on project parameters
 * Uses simplified estimation model for MVP
 */
export function calculateEstimate(
  projectType: ProjectType,
  buildingType: BuildingType,
  yearBuilt: number | null
): PriceEstimate {
  // Base prices per project type (in EUR)
  const basePrices: Record<ProjectType, { min: number; max: number }> = {
    roof: { min: 12000, max: 35000 },
    facade: { min: 8000, max: 25000 },
    insulation: { min: 5000, max: 18000 },
    solar: { min: 6000, max: 15000 },
    combo: { min: 20000, max: 50000 },
  }

  // Building type multipliers
  const buildingMultipliers: Record<BuildingType, number> = {
    row: 1.0,
    semi_detached: 1.15,
    detached: 1.3,
    apartment: 0.8,
  }

  // Age factor (older = more expensive)
  const currentYear = new Date().getFullYear()
  const age = yearBuilt ? currentYear - yearBuilt : 30
  const ageFactor = age > 50 ? 1.2 : age > 30 ? 1.1 : 1.0

  const base = basePrices[projectType]
  const multiplier = buildingMultipliers[buildingType] * ageFactor

  const min = Math.round(base.min * multiplier)
  const max = Math.round(base.max * multiplier)

  // Calculate breakdown (rough estimates)
  const materialsPercent = 0.4
  const laborPercent = 0.35
  const scaffoldingPercent = projectType === 'roof' || projectType === 'facade' ? 0.15 : 0.05
  const insulationPercent = projectType === 'insulation' || projectType === 'combo' ? 0.1 : 0.05

  return {
    min,
    max,
    currency: 'EUR',
    breakdown: {
      materials: [Math.round(min * materialsPercent), Math.round(max * materialsPercent)],
      labor: [Math.round(min * laborPercent), Math.round(max * laborPercent)],
      scaffolding: [Math.round(min * scaffoldingPercent), Math.round(max * scaffoldingPercent)],
      insulation: [Math.round(min * insulationPercent), Math.round(max * insulationPercent)],
    },
  }
}

/**
 * Format price as EUR currency
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format price range
 */
export function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} - ${formatPrice(max)}`
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add lib/utils/pricing.ts
git commit -m "feat: add pricing utility functions for estimate calculation"
```

---

### Task 20: Create ContractorsRepository

**Files:**
- Create: `lib/repositories/ContractorsRepository.ts`

**Step 1: Create repository for contractor matching**

`lib/repositories/ContractorsRepository.ts`:
```typescript
import { createClient } from '@/lib/supabase/server'
import type { Contractor, MatchCriteria } from '@/types/contractor.types'
import type { ProjectType } from '@/types/lead.types'

/**
 * Repository for contractor operations
 * Handles contractor matching and retrieval
 */
export class ContractorsRepository {
  /**
   * Find contractors matching the given criteria
   * Returns up to 3 contractors sorted by match quality
   */
  static async findMatching(criteria: MatchCriteria): Promise<Contractor[]> {
    const supabase = createClient()

    // Build query based on project type
    let query = supabase
      .from('contractors')
      .select('*')
      .eq('verified', true)
      .eq('financially_healthy', true)

    // Filter by region if specified
    if (criteria.region) {
      query = query.eq('region', criteria.region)
    }

    // Filter by project type capability
    const projectTypeMap: Record<string, string> = {
      roof: 'offers_roof',
      facade: 'offers_facade',
      insulation: 'offers_insulation',
      solar: 'offers_solar',
    }

    if (criteria.projectType === 'combo') {
      // For combo projects, require all capabilities
      query = query
        .eq('offers_roof', true)
        .eq('offers_facade', true)
        .eq('offers_insulation', true)
    } else if (projectTypeMap[criteria.projectType]) {
      query = query.eq(projectTypeMap[criteria.projectType], true)
    }

    // Execute query
    const { data: contractors, error } = await query

    if (error) {
      console.error('Error fetching contractors:', error)
      return []
    }

    if (!contractors || contractors.length === 0) {
      return []
    }

    // Score and sort contractors
    const scored = contractors.map((contractor) => ({
      ...this.mapDatabaseToContractor(contractor),
      score: this.calculateMatchScore(contractor, criteria),
    }))

    // Sort by score and return top 3
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ score, ...contractor }) => contractor)
  }

  /**
   * Calculate match score for a contractor
   * Higher score = better match
   */
  private static calculateMatchScore(contractor: any, criteria: MatchCriteria): number {
    let score = 0

    // Base score for verified + financially healthy
    score += 100

    // Bonus for full premium guidance
    if (contractor.full_guidance_premiums) {
      score += 30
    }

    // Budget match score
    if (criteria.budgetMin && criteria.budgetMax) {
      const budgetMid = (criteria.budgetMin + criteria.budgetMax) / 2
      const contractorMin = contractor.avg_project_value_min || 0
      const contractorMax = contractor.avg_project_value_max || Infinity

      if (budgetMid >= contractorMin && budgetMid <= contractorMax) {
        score += 50
      }
    }

    // Rating score
    if (contractor.rating) {
      score += contractor.rating * 10
    }

    // Priority-based adjustments
    if (criteria.priority === 'quality' && contractor.rating > 4.5) {
      score += 20
    }

    return score
  }

  /**
   * Map database row to Contractor type
   */
  private static mapDatabaseToContractor(row: any): Contractor {
    return {
      id: row.id,
      name: row.name,
      city: row.city,
      region: row.region,
      website: row.website,
      email: row.email,
      phone: row.phone,
      verified: row.verified,
      financiallyHealthy: row.financially_healthy,
      fullGuidancePremiums: row.full_guidance_premiums,
      offersRoof: row.offers_roof,
      offersFacade: row.offers_facade,
      offersInsulation: row.offers_insulation,
      offersSolar: row.offers_solar,
      avgProjectValueMin: row.avg_project_value_min,
      avgProjectValueMax: row.avg_project_value_max,
      avgProjectsPerYear: row.avg_projects_per_year,
      rating: row.rating,
      notes: row.notes,
      createdAt: row.created_at,
    }
  }

  /**
   * Get contractor by ID
   */
  static async getById(id: string): Promise<Contractor | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('contractors')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return null
    }

    return this.mapDatabaseToContractor(data)
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add lib/repositories/ContractorsRepository.ts
git commit -m "feat: add ContractorsRepository with matching logic"
```

---

### Task 21: Create LeadsRepository

**Files:**
- Create: `lib/repositories/LeadsRepository.ts`

**Step 1: Create repository for lead persistence**

`lib/repositories/LeadsRepository.ts`:
```typescript
import { createClient } from '@/lib/supabase/server'
import type { CreateLeadInput, Lead } from '@/types/lead.types'

/**
 * Repository for lead operations
 * Handles lead creation and retrieval
 */
export class LeadsRepository {
  /**
   * Create a new lead in the database
   */
  static async create(input: CreateLeadInput): Promise<Lead | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('leads')
      .insert({
        // Contact info
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        phone: input.phone,
        // Address
        address: input.address,
        postal_code: input.postalCode,
        city: input.city,
        // Project details
        project_type: input.projectType,
        building_type: input.buildingType,
        year_built: input.yearBuilt,
        urgency: input.urgency,
        budget_min: input.budgetRange[0],
        budget_max: input.budgetRange[1],
        priority: input.priority,
        extra_info: input.extraInfo,
        // Estimate
        estimate_min: input.estimate.min,
        estimate_max: input.estimate.max,
        estimate_currency: input.estimate.currency,
        // Matching
        matched_contractor_ids: input.matchedContractorIds,
        chosen_contractor_id: input.chosenContractorId,
        // Metadata
        source: input.source || 'web',
        status: 'new',
      })
      .select()
      .single()

    if (error || !data) {
      console.error('Error creating lead:', error)
      return null
    }

    return this.mapDatabaseToLead(data)
  }

  /**
   * Map database row to Lead type
   */
  private static mapDatabaseToLead(row: any): Lead {
    return {
      id: row.id,
      createdAt: row.created_at,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      postalCode: row.postal_code,
      city: row.city,
      projectType: row.project_type,
      buildingType: row.building_type,
      yearBuilt: row.year_built,
      urgency: row.urgency,
      budgetRange: [row.budget_min, row.budget_max],
      priority: row.priority,
      extraInfo: row.extra_info,
      estimate: {
        min: row.estimate_min,
        max: row.estimate_max,
        currency: row.estimate_currency,
        breakdown: {
          materials: [0, 0],
          labor: [0, 0],
          scaffolding: [0, 0],
          insulation: [0, 0],
        },
      },
      matchedContractorIds: row.matched_contractor_ids || [],
      chosenContractorId: row.chosen_contractor_id,
      source: row.source,
      status: row.status,
      notes: row.notes,
    }
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add lib/repositories/LeadsRepository.ts
git commit -m "feat: add LeadsRepository for lead persistence"
```

---

### Task 22: Create Form Validation Schemas

**Files:**
- Create: `lib/validation/lead-finder.schemas.ts`

**Step 1: Create Zod validation schemas**

`lib/validation/lead-finder.schemas.ts`:
```typescript
import { z } from 'zod'

/**
 * Validation schema for Lead Finder form
 */
export const leadFinderFormSchema = z.object({
  // Address fields
  address: z.string().min(5, 'Adres moet minimaal 5 karakters bevatten'),
  postalCode: z.string().regex(/^\d{4}$/, 'Postcode moet 4 cijfers bevatten'),
  city: z.string().min(2, 'Stad moet minimaal 2 karakters bevatten'),

  // Project details
  projectType: z.enum(['roof', 'facade', 'insulation', 'solar', 'combo'], {
    required_error: 'Selecteer een projecttype',
  }),
  buildingType: z.enum(['row', 'semi_detached', 'detached', 'apartment'], {
    required_error: 'Selecteer een woningtype',
  }),
  yearBuilt: z
    .number({ invalid_type_error: 'Bouwjaar moet een getal zijn' })
    .min(1900, 'Bouwjaar moet na 1900 zijn')
    .max(new Date().getFullYear(), 'Bouwjaar kan niet in de toekomst liggen')
    .nullable(),
  urgency: z.enum(['1-3m', '3-6m', '6-12m', 'exploring'], {
    required_error: 'Selecteer een urgentie',
  }),
  budgetRange: z.tuple([z.number().min(0), z.number().min(0)]),
  priority: z.enum(['price', 'balance', 'quality']),
})

/**
 * Validation schema for contact information
 */
export const contactInfoSchema = z.object({
  firstName: z.string().min(2, 'Voornaam moet minimaal 2 karakters bevatten'),
  lastName: z.string().min(2, 'Achternaam moet minimaal 2 karakters bevatten'),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z
    .string()
    .regex(/^(\+32|0)[1-9]\d{7,8}$/, 'Ongeldig Belgisch telefoonnummer')
    .optional()
    .or(z.literal('')),
  extraInfo: z.string().max(500, 'Maximaal 500 karakters').optional(),
})

export type LeadFinderFormData = z.infer<typeof leadFinderFormSchema>
export type ContactInfoData = z.infer<typeof contactInfoSchema>
```

**Step 2: Create validation directory**

Run: `mkdir -p lib/validation`

**Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 4: Commit**

```bash
git add lib/validation/
git commit -m "feat: add form validation schemas with Zod"
```

---

### Task 23: Create LeadFinderContext

**Files:**
- Create: `features/lead-finder/context/LeadFinderContext.tsx`

**Step 1: Create context for form state management**

`features/lead-finder/context/LeadFinderContext.tsx`:
```typescript
'use client'

import React, { createContext, useContext, useState } from 'react'
import type { FormData, ContactInfo, PriceEstimate } from '@/types/lead.types'
import type { Contractor } from '@/types/contractor.types'

interface LeadFinderContextType {
  // Form data
  formData: Partial<FormData>
  setFormData: (data: Partial<FormData>) => void
  contactInfo: Partial<ContactInfo>
  setContactInfo: (data: Partial<ContactInfo>) => void

  // Results
  estimate: PriceEstimate | null
  setEstimate: (estimate: PriceEstimate | null) => void
  matchedContractors: Contractor[]
  setMatchedContractors: (contractors: Contractor[]) => void
  selectedContractor: Contractor | null
  setSelectedContractor: (contractor: Contractor | null) => void

  // UI state
  currentStep: 'form' | 'results' | 'contact' | 'complete'
  setCurrentStep: (step: 'form' | 'results' | 'contact' | 'complete') => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void

  // Actions
  resetForm: () => void
}

const LeadFinderContext = createContext<LeadFinderContextType | undefined>(undefined)

const initialFormData: Partial<FormData> = {
  budgetRange: [10000, 30000],
  priority: 'balance',
}

export function LeadFinderProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<Partial<FormData>>(initialFormData)
  const [contactInfo, setContactInfo] = useState<Partial<ContactInfo>>({})
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null)
  const [matchedContractors, setMatchedContractors] = useState<Contractor[]>([])
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null)
  const [currentStep, setCurrentStep] = useState<'form' | 'results' | 'contact' | 'complete'>('form')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setFormData(initialFormData)
    setContactInfo({})
    setEstimate(null)
    setMatchedContractors([])
    setSelectedContractor(null)
    setCurrentStep('form')
    setIsLoading(false)
    setError(null)
  }

  return (
    <LeadFinderContext.Provider
      value={{
        formData,
        setFormData,
        contactInfo,
        setContactInfo,
        estimate,
        setEstimate,
        matchedContractors,
        setMatchedContractors,
        selectedContractor,
        setSelectedContractor,
        currentStep,
        setCurrentStep,
        isLoading,
        setIsLoading,
        error,
        setError,
        resetForm,
      }}
    >
      {children}
    </LeadFinderContext.Provider>
  )
}

export function useLeadFinderContext() {
  const context = useContext(LeadFinderContext)
  if (!context) {
    throw new Error('useLeadFinderContext must be used within a LeadFinderProvider')
  }
  return context
}
```

**Step 2: Create feature directory structure**

Run: `mkdir -p features/lead-finder/context features/lead-finder/components`

**Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 4: Commit**

```bash
git add features/lead-finder/
git commit -m "feat: add LeadFinderContext for form state management"
```

---

### Task 24: Create API Route for Lead Submission

**Files:**
- Create: `app/api/leads/submit/route.ts`

**Step 1: Create API route for lead submission**

`app/api/leads/submit/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { LeadsRepository } from '@/lib/repositories/LeadsRepository'
import { ContractorsRepository } from '@/lib/repositories/ContractorsRepository'
import { CreditsRepository } from '@/lib/repositories/CreditsRepository'
import { calculateEstimate } from '@/lib/utils/pricing'
import type { CreateLeadInput } from '@/types/lead.types'
import type { MatchCriteria } from '@/types/contractor.types'

export async function POST(request: NextRequest) {
  try {
    // Check if user has credits
    const creditStatus = await CreditsRepository.getStatus()
    if (!creditStatus.canUseCredit) {
      return NextResponse.json(
        { error: 'No credits available' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      formData,
      contactInfo,
    } = body

    // Calculate estimate
    const estimate = calculateEstimate(
      formData.projectType,
      formData.buildingType,
      formData.yearBuilt
    )

    // Find matching contractors
    const matchCriteria: MatchCriteria = {
      region: formData.city, // Simplified: use city as region
      projectType: formData.projectType,
      budgetMin: formData.budgetRange[0],
      budgetMax: formData.budgetRange[1],
      priority: formData.priority,
    }

    const contractors = await ContractorsRepository.findMatching(matchCriteria)

    // Create lead input
    const leadInput: CreateLeadInput = {
      ...formData,
      ...contactInfo,
      estimate,
      matchedContractorIds: contractors.map((c) => c.id),
      source: 'web',
    }

    // Save lead to database
    const lead = await LeadsRepository.create(leadInput)

    if (!lead) {
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      )
    }

    // Use a credit
    await CreditsRepository.useCredit()

    // Return results
    return NextResponse.json({
      success: true,
      estimate,
      contractors,
      leadId: lead.id,
    })
  } catch (error) {
    console.error('Error submitting lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Step 2: Create API directory**

Run: `mkdir -p app/api/leads/submit`

**Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 4: Commit**

```bash
git add app/api/leads/
git commit -m "feat: add API route for lead submission with credit check"
```

---

### Task 25: Create LeadFinderForm Component

**Files:**
- Create: `features/lead-finder/components/LeadFinderForm.tsx`

**Step 1: Create form component**

`features/lead-finder/components/LeadFinderForm.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { useLeadFinderContext } from '../context/LeadFinderContext'
import { useCreditContext } from '@/features/credits/context/CreditContext'
import { Home, Building2, Calendar, Zap } from 'lucide-react'
import type { ProjectType, BuildingType, Urgency, Priority } from '@/types/lead.types'

export function LeadFinderForm() {
  const { formData, setFormData, setCurrentStep, setIsLoading, setError } = useLeadFinderContext()
  const { canUseCredit } = useCreditContext()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const newErrors: Record<string, string> = {}

    if (!formData.address) newErrors.address = 'Adres is verplicht'
    if (!formData.postalCode) newErrors.postalCode = 'Postcode is verplicht'
    if (!formData.city) newErrors.city = 'Stad is verplicht'
    if (!formData.projectType) newErrors.projectType = 'Selecteer een projecttype'
    if (!formData.buildingType) newErrors.buildingType = 'Selecteer een woningtype'
    if (!formData.urgency) newErrors.urgency = 'Selecteer wanneer je wilt starten'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (!canUseCredit) {
      setError('Je hebt geen credits meer beschikbaar')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/leads/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      const result = await response.json()

      // Update context with results
      setCurrentStep('results')
    } catch (error) {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  const projectTypes: { value: ProjectType; label: string; icon: any }[] = [
    { value: 'roof', label: 'Dak renovatie', icon: Home },
    { value: 'facade', label: 'Gevel renovatie', icon: Building2 },
    { value: 'insulation', label: 'Isolatie', icon: Home },
    { value: 'solar', label: 'Zonnepanelen', icon: Zap },
    { value: 'combo', label: 'Combinatie', icon: Building2 },
  ]

  const buildingTypes: { value: BuildingType; label: string }[] = [
    { value: 'row', label: 'Rijwoning' },
    { value: 'semi_detached', label: 'Halfopen woning' },
    { value: 'detached', label: 'Vrijstaande woning' },
    { value: 'apartment', label: 'Appartement' },
  ]

  const urgencyOptions: { value: Urgency; label: string }[] = [
    { value: '1-3m', label: '1-3 maanden' },
    { value: '3-6m', label: '3-6 maanden' },
    { value: '6-12m', label: '6-12 maanden' },
    { value: 'exploring', label: 'Ik ben aan het verkennen' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Address Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Projectadres</h3>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-2">
            Straat en nummer
          </label>
          <input
            id="address"
            type="text"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            placeholder="Voorbeeld: Kerkstraat 123"
          />
          {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-slate-300 mb-2">
              Postcode
            </label>
            <input
              id="postalCode"
              type="text"
              value={formData.postalCode || ''}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="2000"
              maxLength={4}
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-400">{errors.postalCode}</p>}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-2">
              Stad
            </label>
            <input
              id="city"
              type="text"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Antwerpen"
            />
            {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city}</p>}
          </div>
        </div>
      </div>

      {/* Project Type */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Type project</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {projectTypes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData({ ...formData, projectType: value })}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                formData.projectType === value
                  ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
        {errors.projectType && <p className="mt-1 text-sm text-red-400">{errors.projectType}</p>}
      </div>

      {/* Building Type */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Type woning</h3>
        <div className="grid grid-cols-2 gap-3">
          {buildingTypes.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData({ ...formData, buildingType: value })}
              className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                formData.buildingType === value
                  ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.buildingType && <p className="mt-1 text-sm text-red-400">{errors.buildingType}</p>}
      </div>

      {/* Year Built */}
      <div className="space-y-4">
        <label htmlFor="yearBuilt" className="block text-lg font-semibold text-slate-100">
          Bouwjaar (optioneel)
        </label>
        <input
          id="yearBuilt"
          type="number"
          value={formData.yearBuilt || ''}
          onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value ? parseInt(e.target.value) : null })}
          className="w-full max-w-xs rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="1990"
          min={1900}
          max={new Date().getFullYear()}
        />
      </div>

      {/* Urgency */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Wanneer wil je starten?</h3>
        <div className="grid grid-cols-2 gap-3">
          {urgencyOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData({ ...formData, urgency: value })}
              className={`rounded-lg border p-3 text-sm font-medium transition-colors ${
                formData.urgency === value
                  ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.urgency && <p className="mt-1 text-sm text-red-400">{errors.urgency}</p>}
      </div>

      {/* Budget Range */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Indicatief budget</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-300">
            <span>€{formData.budgetRange?.[0].toLocaleString('nl-BE') || '10.000'}</span>
            <span>€{formData.budgetRange?.[1].toLocaleString('nl-BE') || '30.000'}</span>
          </div>
          <input
            type="range"
            min="5000"
            max="100000"
            step="1000"
            value={formData.budgetRange?.[1] || 30000}
            onChange={(e) => setFormData({
              ...formData,
              budgetRange: [formData.budgetRange?.[0] || 10000, parseInt(e.target.value)]
            })}
            className="w-full"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!canUseCredit}
        className="w-full rounded-full bg-amber-400 text-slate-950 font-semibold px-8 py-3 shadow-lg shadow-amber-400/30 hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Bereken mijn offerte
      </button>
    </form>
  )
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add features/lead-finder/components/LeadFinderForm.tsx
git commit -m "feat: add LeadFinderForm component with validation"
```

---

### Task 26: Create LeadFinderResults Component

**Files:**
- Create: `features/lead-finder/components/LeadFinderResults.tsx`

**Step 1: Create results display component**

`features/lead-finder/components/LeadFinderResults.tsx`:
```typescript
'use client'

import { useLeadFinderContext } from '../context/LeadFinderContext'
import { CheckCircle2, Building, Award, Phone, Mail, ExternalLink } from 'lucide-react'
import { formatPriceRange } from '@/lib/utils/pricing'

export function LeadFinderResults() {
  const { estimate, matchedContractors, setCurrentStep } = useLeadFinderContext()

  if (!estimate) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Estimate Section */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">Jouw indicatieve offerte</h3>
            <p className="text-sm text-slate-400">
              Gebaseerd op je projectgegevens
            </p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="text-3xl font-bold text-sky-300 mb-6">
          {formatPriceRange(estimate.min, estimate.max)}
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300">Kostenverdeling</h4>
          {Object.entries(estimate.breakdown).map(([key, [min, max]]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-slate-400 capitalize">{key}</span>
              <span className="text-slate-200">{formatPriceRange(min, max)}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-500">
          * Dit is een indicatieve schatting. De exacte prijs hangt af van je specifieke situatie.
        </p>
      </div>

      {/* Matched Contractors */}
      <div>
        <h3 className="text-xl font-semibold text-slate-100 mb-4">
          Geselecteerde aannemers ({matchedContractors.length})
        </h3>

        {matchedContractors.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center">
            <p className="text-slate-400">
              Geen aannemers gevonden voor jouw regio en project. Probeer een andere postcode.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matchedContractors.map((contractor) => (
              <div
                key={contractor.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-100">{contractor.name}</h4>
                    <p className="text-sm text-slate-400">{contractor.city}, {contractor.region}</p>
                  </div>
                  {contractor.rating && (
                    <div className="flex items-center gap-1 rounded-full bg-amber-400/10 border border-amber-400/30 px-3 py-1">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-semibold text-amber-300">{contractor.rating}</span>
                    </div>
                  )}
                </div>

                {contractor.notes && (
                  <p className="text-sm text-slate-300 mb-4">{contractor.notes}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {contractor.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      Geverifieerd
                    </span>
                  )}
                  {contractor.financiallyHealthy && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 border border-sky-500/30 px-3 py-1 text-xs text-sky-300">
                      Financieel gezond
                    </span>
                  )}
                  {contractor.fullGuidancePremiums && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs text-amber-300">
                      Premie-expert
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                  {contractor.phone && (
                    <a href={`tel:${contractor.phone}`} className="flex items-center gap-1 hover:text-slate-200">
                      <Phone className="w-4 h-4" />
                      {contractor.phone}
                    </a>
                  )}
                  {contractor.email && (
                    <a href={`mailto:${contractor.email}`} className="flex items-center gap-1 hover:text-slate-200">
                      <Mail className="w-4 h-4" />
                      {contractor.email}
                    </a>
                  )}
                  {contractor.website && (
                    <a
                      href={contractor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-slate-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-2">Volgende stappen</h4>
        <p className="text-sm text-slate-300 mb-4">
          Neem contact op met de aannemers die het beste bij jouw project passen.
          Ze kunnen je een exacte offerte geven na een bezoek ter plaatse.
        </p>
        <button
          onClick={() => setCurrentStep('contact')}
          className="rounded-full bg-amber-400 text-slate-950 font-semibold px-6 py-2 hover:bg-amber-300 transition-colors"
        >
          Bewaar mijn resultaten
        </button>
      </div>
    </div>
  )
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add features/lead-finder/components/LeadFinderResults.tsx
git commit -m "feat: add LeadFinderResults component with estimate and contractors"
```

---

### Task 27: Create LeadFinderSection Wrapper

**Files:**
- Create: `features/lead-finder/components/LeadFinderSection.tsx`
- Create: `features/lead-finder/index.ts`

**Step 1: Create main section component**

`features/lead-finder/components/LeadFinderSection.tsx`:
```typescript
'use client'

import { LeadFinderProvider, useLeadFinderContext } from '../context/LeadFinderContext'
import { LeadFinderForm } from './LeadFinderForm'
import { LeadFinderResults } from './LeadFinderResults'
import { Sparkles } from 'lucide-react'

function LeadFinderContent() {
  const { currentStep, isLoading, error } = useLeadFinderContext()

  return (
    <section id="tool" className="border-b border-slate-900 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/5 px-4 py-2 text-sm text-sky-200 mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Vind jouw perfecte aannemer</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-50 mb-4">
            Lead Finder Tool
          </h2>
          <p className="text-lg text-slate-300">
            Vul je gegevens in en krijg direct een indicatieve offerte plus matches met geverifieerde aannemers.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-sky-500 mb-4"></div>
            <p className="text-slate-400">Bezig met berekenen...</p>
          </div>
        ) : (
          <>
            {/* Form or Results */}
            {currentStep === 'form' && <LeadFinderForm />}
            {currentStep === 'results' && <LeadFinderResults />}
          </>
        )}
      </div>
    </section>
  )
}

export function LeadFinderSection() {
  return (
    <LeadFinderProvider>
      <LeadFinderContent />
    </LeadFinderProvider>
  )
}
```

**Step 2: Create feature index**

`features/lead-finder/index.ts`:
```typescript
export { LeadFinderSection } from './components/LeadFinderSection'
export { LeadFinderProvider, useLeadFinderContext } from './context/LeadFinderContext'
```

**Step 3: Verify TypeScript compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 4: Commit**

```bash
git add features/lead-finder/
git commit -m "feat: add LeadFinderSection wrapper component"
```

---

### Task 28: Integrate Lead Finder into Landing Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add Lead Finder to page**

Update `app/page.tsx` to include the Lead Finder section before the footer:

```typescript
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { HeroSection } from '@/features/hero'
import { QualityLabelSection } from '@/features/quality-label'
import { HowItWorksSection } from '@/features/how-it-works'
import { ReviewsSection } from '@/features/reviews'
import { FAQSection } from '@/features/faq'
import { LeadFinderSection } from '@/features/lead-finder'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <QualityLabelSection />
      <HowItWorksSection />
      <ReviewsSection />
      <FAQSection />
      <LeadFinderSection />
      <Footer />
    </main>
  )
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: No TypeScript errors

**Step 3: Test in browser**

Run: `npm run dev`
Navigate to: http://localhost:3000
Expected: Lead Finder form appears before footer

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: integrate Lead Finder into landing page"
```

---

## Success Criteria

After completing all tasks, verify:

✅ Lead Finder form collects all required data
✅ Form validation works correctly
✅ Price estimation returns reasonable values
✅ Contractor matching returns results
✅ API route handles credit checks
✅ Results display shows estimate and contractors
✅ TypeScript compiles without errors
✅ No console errors in browser
✅ Responsive design works on mobile/tablet/desktop

---

## Next Steps

After Phase 6 completion:
1. Test end-to-end flow with real Supabase data
2. Add contact form for saving lead with user info
3. Enhance contractor matching algorithm
4. Add loading states and better error handling
5. Deploy to Vercel for production testing
