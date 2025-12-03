import { SupabaseClient } from '@supabase/supabase-js'
import { CreditSession, CreditStatus } from '@/types/credit.types'

export class CreditsRepository {
  constructor(private supabase: SupabaseClient) {}

  async getStatus(sessionToken: string): Promise<CreditStatus> {
    const { data, error } = await this.supabase
      .from('credit_sessions')
      .select('credits_total, credits_used')
      .eq('session_token', sessionToken)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is fine for new sessions
      throw new Error(`Failed to get credit status: ${error.message}`)
    }

    // If no session exists, return default (1 credit available)
    if (!data) {
      return {
        creditsTotal: 1,
        creditsUsed: 0,
        canUseCredit: true,
      }
    }

    return {
      creditsTotal: data.credits_total,
      creditsUsed: data.credits_used,
      canUseCredit: data.credits_used < data.credits_total,
    }
  }

  async createSession(sessionToken: string): Promise<CreditSession> {
    const { data, error } = await this.supabase
      .from('credit_sessions')
      .insert({
        session_token: sessionToken,
        credits_total: 1,
        credits_used: 0,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create session: ${error.message}`)
    }

    return {
      id: data.id,
      sessionToken: data.session_token,
      creditsTotal: data.credits_total,
      creditsUsed: data.credits_used,
      firstUsedAt: data.first_used_at,
      lastUsedAt: data.last_used_at,
      createdAt: data.created_at,
    }
  }

  async useCredit(sessionToken: string): Promise<void> {
    // First, ensure session exists
    const { data: existing } = await this.supabase
      .from('credit_sessions')
      .select('id, credits_total, credits_used')
      .eq('session_token', sessionToken)
      .single()

    if (!existing) {
      // Create session first
      await this.createSession(sessionToken)
    }

    // Check if credit is available
    const status = await this.getStatus(sessionToken)
    if (!status.canUseCredit) {
      throw new Error('No credits available')
    }

    // Use the credit
    const { error } = await this.supabase
      .from('credit_sessions')
      .update({
        credits_used: status.creditsUsed + 1,
        first_used_at: status.creditsUsed === 0 ? new Date().toISOString() : undefined,
        last_used_at: new Date().toISOString(),
      })
      .eq('session_token', sessionToken)

    if (error) {
      throw new Error(`Failed to use credit: ${error.message}`)
    }
  }

  async getOrCreateSession(sessionToken: string): Promise<CreditSession> {
    const { data: existing } = await this.supabase
      .from('credit_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single()

    if (existing) {
      return {
        id: existing.id,
        sessionToken: existing.session_token,
        creditsTotal: existing.credits_total,
        creditsUsed: existing.credits_used,
        firstUsedAt: existing.first_used_at,
        lastUsedAt: existing.last_used_at,
        createdAt: existing.created_at,
      }
    }

    return this.createSession(sessionToken)
  }
}
