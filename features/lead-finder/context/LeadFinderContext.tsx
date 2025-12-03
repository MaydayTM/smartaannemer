'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { FormData, PriceEstimate, ProjectType, BuildingType, Urgency, Priority } from '@/types/lead.types'
import { Contractor } from '@/types/contractor.types'
import { calculateEstimate } from '@/lib/utils/pricing'

interface LeadFinderState {
  formData: FormData
  estimate: PriceEstimate | null
  contractors: Contractor[]
  isEstimating: boolean
  hasUsedCredit: boolean
  error: string | null
}

interface LeadFinderContextValue extends LeadFinderState {
  updateForm: (updates: Partial<FormData>) => void
  submitEstimate: () => Promise<boolean>
  reset: () => void
}

const LeadFinderContext = createContext<LeadFinderContextValue | null>(null)

const initialFormData: FormData = {
  address: '',
  postalCode: '',
  city: '',
  projectType: null,
  buildingType: null,
  yearBuilt: null,
  urgency: null,
  budgetRange: [10000, 30000],
  priority: 'balance',
}

export function LeadFinderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LeadFinderState>({
    formData: initialFormData,
    estimate: null,
    contractors: [],
    isEstimating: false,
    hasUsedCredit: false,
    error: null,
  })

  const updateForm = useCallback((updates: Partial<FormData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...updates },
    }))
  }, [])

  const submitEstimate = useCallback(async (): Promise<boolean> => {
    const { formData } = state

    // Validation
    if (!formData.projectType || !formData.buildingType) {
      setState(prev => ({ ...prev, error: 'Selecteer een projecttype en woningtype' }))
      return false
    }

    setState(prev => ({ ...prev, isEstimating: true, error: null }))

    try {
      // Calculate estimate locally
      const estimate = calculateEstimate(
        formData.projectType,
        formData.buildingType,
        formData.yearBuilt
      )

      // Fetch matching contractors
      const response = await fetch('/api/contractors/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType: formData.projectType,
          region: formData.city || 'België',
          budgetMin: formData.budgetRange[0],
          budgetMax: formData.budgetRange[1],
          priority: formData.priority,
        }),
      })

      let contractors: Contractor[] = []
      if (response.ok) {
        const data = await response.json()
        contractors = data.contractors || []
      }

      setState(prev => ({
        ...prev,
        estimate,
        contractors,
        isEstimating: false,
        hasUsedCredit: true,
      }))

      return true
    } catch (error) {
      setState(prev => ({
        ...prev,
        isEstimating: false,
        error: 'Er is een fout opgetreden. Probeer het opnieuw.',
      }))
      return false
    }
  }, [state])

  const reset = useCallback(() => {
    setState({
      formData: initialFormData,
      estimate: null,
      contractors: [],
      isEstimating: false,
      hasUsedCredit: false,
      error: null,
    })
  }, [])

  return (
    <LeadFinderContext.Provider
      value={{
        ...state,
        updateForm,
        submitEstimate,
        reset,
      }}
    >
      {children}
    </LeadFinderContext.Provider>
  )
}

export function useLeadFinder() {
  const context = useContext(LeadFinderContext)
  if (!context) {
    throw new Error('useLeadFinder must be used within a LeadFinderProvider')
  }
  return context
}
