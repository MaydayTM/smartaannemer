import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { CreditSession, CreditStatus } from '@/types/credit.types'
import { cookies } from 'next/headers'

const CREDIT_SESSION_COOKIE = 'smart_aannemer_session'
const CREDITS_PER_SESSION = 1

/**
 * Repository for credit session management
 * Handles session creation, credit tracking, and usage
 */
export class CreditsRepository {
  /**
   * Get or create session token from cookies
   * @returns Session token
   */
  static async getSessionToken(): Promise<string> {
    const cookieStore = await cookies()
    const existingToken = cookieStore.get(CREDIT_SESSION_COOKIE)?.value

    if (existingToken) {
      return existingToken
    }

    // Generate new session token
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const newToken = 'sess_' + timestamp + '_' + randomStr

    // Set cookie (expires in 30 days)
    (await cookies()).set(CREDIT_SESSION_COOKIE, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return newToken
  }

  /**
   * Get credit status for current session
   * Creates a new session if one doesn't exist
   */
  static async getStatus(): Promise<CreditStatus> {
    const supabase = createServerClient()
    const sessionToken = await this.getSessionToken()

    // Try to find existing session
    const { data: session, error } = await supabase
      .from('credit_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single()

    if (error || !session) {
      // Create new session
      const { data: newSession, error: createError } = await supabase
        .from('credit_sessions')
        .insert({
          session_token: sessionToken,
          credits_total: CREDITS_PER_SESSION,
          credits_used: 0,
        })
        .select()
        .single()

      if (createError || !newSession) {
        console.error('Failed to create credit session:', createError)
        return {
          creditsTotal: CREDITS_PER_SESSION,
          creditsUsed: 0,
          canUseCredit: true,
        }
      }

      return {
        creditsTotal: newSession.credits_total,
        creditsUsed: newSession.credits_used,
        canUseCredit: newSession.credits_used < newSession.credits_total,
      }
    }

    return {
      creditsTotal: session.credits_total,
      creditsUsed: session.credits_used,
      canUseCredit: session.credits_used < session.credits_total,
    }
  }

  /**
   * Use a credit from the current session
   * @returns Updated credit status or null if no credits available
   */
  static async useCredit(): Promise<CreditStatus | null> {
    const supabase = createServerClient()
    const sessionToken = await this.getSessionToken()

    // Get current session
    const { data: session } = await supabase
      .from('credit_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single()

    if (!session) {
      return null
    }

    // Check if credits available
    if (session.credits_used >= session.credits_total) {
      return {
        creditsTotal: session.credits_total,
        creditsUsed: session.credits_used,
        canUseCredit: false,
      }
    }

    // Use a credit
    const now = new Date().toISOString()
    const { data: updatedSession, error } = await supabase
      .from('credit_sessions')
      .update({
        credits_used: session.credits_used + 1,
        first_used_at: session.first_used_at || now,
        last_used_at: now,
      })
      .eq('session_token', sessionToken)
      .select()
      .single()

    if (error || !updatedSession) {
      console.error('Failed to use credit:', error)
      return null
    }

    return {
      creditsTotal: updatedSession.credits_total,
      creditsUsed: updatedSession.credits_used,
      canUseCredit: updatedSession.credits_used < updatedSession.credits_total,
    }
  }

  /**
   * Browser-side method to get credit status
   * Used in client components
   */
  static async getStatusFromBrowser(): Promise<CreditStatus> {
    try {
      // Call API route to get status
      const response = await fetch('/api/credits/status')
      if (!response.ok) {
        throw new Error('Failed to fetch credit status')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching credit status:', error)
      return {
        creditsTotal: CREDITS_PER_SESSION,
        creditsUsed: 0,
        canUseCredit: true,
      }
    }
  }

  /**
   * Browser-side method to use a credit
   * Used in client components
   */
  static async useCreditFromBrowser(): Promise<CreditStatus | null> {
    try {
      const response = await fetch('/api/credits/use', {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to use credit')
      }
      return await response.json()
    } catch (error) {
      console.error('Error using credit:', error)
      return null
    }
  }
}
