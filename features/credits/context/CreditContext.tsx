'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { CreditStatus } from '@/types/credit.types'
import { CreditsRepository } from '@/lib/repositories/CreditsRepository'

interface CreditContextType extends CreditStatus {
  isLoading: boolean
  useCredit: () => Promise<boolean>
  refreshStatus: () => Promise<void>
}

const CreditContext = createContext<CreditContextType | undefined>(undefined)

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<CreditStatus>({
    creditsTotal: 1,
    creditsUsed: 0,
    canUseCredit: true,
  })
  const [isLoading, setIsLoading] = useState(true)

  const refreshStatus = useCallback(async () => {
    try {
      setIsLoading(true)
      const newStatus = await CreditsRepository.getStatusFromBrowser()
      setStatus(newStatus)
    } catch (error) {
      console.error('Failed to refresh credit status:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const useCredit = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      const newStatus = await CreditsRepository.useCreditFromBrowser()

      if (!newStatus) {
        return false
      }

      setStatus(newStatus)
      return true
    } catch (error) {
      console.error('Failed to use credit:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load initial status
  useEffect(() => {
    refreshStatus()
  }, [refreshStatus])

  return (
    <CreditContext.Provider
      value={{
        ...status,
        isLoading,
        useCredit,
        refreshStatus,
      }}
    >
      {children}
    </CreditContext.Provider>
  )
}

export function useCreditContext() {
  const context = useContext(CreditContext)
  if (!context) {
    throw new Error('useCreditContext must be used within a CreditProvider')
  }
  return context
}
