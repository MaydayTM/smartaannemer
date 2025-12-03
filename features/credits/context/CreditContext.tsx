'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { CreditStatus } from '@/types/credit.types'

interface CreditContextValue extends CreditStatus {
  isLoading: boolean
  error: string | null
  useCredit: () => Promise<boolean>
  refreshStatus: () => Promise<void>
}

const CreditContext = createContext<CreditContextValue | null>(null)

const CREDIT_SESSION_KEY = 'credit_session_token'

export function CreditProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CreditStatus>({
    creditsTotal: 1,
    creditsUsed: 0,
    canUseCredit: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get or create session token
  const getSessionToken = useCallback((): string => {
    if (typeof window === 'undefined') return ''

    let token = localStorage.getItem(CREDIT_SESSION_KEY)
    if (!token) {
      token = crypto.randomUUID()
      localStorage.setItem(CREDIT_SESSION_KEY, token)
    }
    return token
  }, [])

  // Fetch credit status from API
  const refreshStatus = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const token = getSessionToken()
      if (!token) return

      const response = await fetch(`/api/credits?token=${token}`)

      if (!response.ok) {
        throw new Error('Failed to fetch credit status')
      }

      const data = await response.json()
      setStatus({
        creditsTotal: data.creditsTotal,
        creditsUsed: data.creditsUsed,
        canUseCredit: data.creditsUsed < data.creditsTotal,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      // Default to allowing credit on error (fail open for MVP)
      setStatus({
        creditsTotal: 1,
        creditsUsed: 0,
        canUseCredit: true,
      })
    } finally {
      setIsLoading(false)
    }
  }, [getSessionToken])

  // Use a credit
  const useCredit = useCallback(async (): Promise<boolean> => {
    if (!status.canUseCredit) {
      setError('No credits available')
      return false
    }

    try {
      setIsLoading(true)
      setError(null)

      const token = getSessionToken()
      const response = await fetch('/api/credits/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to use credit')
      }

      // Update local state
      setStatus(prev => ({
        ...prev,
        creditsUsed: prev.creditsUsed + 1,
        canUseCredit: prev.creditsUsed + 1 < prev.creditsTotal,
      }))

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [status.canUseCredit, getSessionToken])

  // Initialize on mount
  useEffect(() => {
    refreshStatus()
  }, [refreshStatus])

  return (
    <CreditContext.Provider
      value={{
        ...status,
        isLoading,
        error,
        useCredit,
        refreshStatus,
      }}
    >
      {children}
    </CreditContext.Provider>
  )
}

export function useCredits() {
  const context = useContext(CreditContext)
  if (!context) {
    throw new Error('useCredits must be used within a CreditProvider')
  }
  return context
}
