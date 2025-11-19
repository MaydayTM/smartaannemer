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
