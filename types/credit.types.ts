export interface CreditSession {
  id: string
  sessionToken: string
  creditsTotal: number
  creditsUsed: number
  firstUsedAt?: string
  lastUsedAt?: string
  createdAt: string
}

export interface CreditStatus {
  creditsTotal: number
  creditsUsed: number
  canUseCredit: boolean
}
