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
