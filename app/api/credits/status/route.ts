import { NextResponse } from 'next/server'
import { CreditsRepository } from '@/lib/repositories/CreditsRepository'

export async function GET() {
  try {
    const status = await CreditsRepository.getStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error('Error getting credit status:', error)
    return NextResponse.json(
      { error: 'Failed to get credit status' },
      { status: 500 }
    )
  }
}
