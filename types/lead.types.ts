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
