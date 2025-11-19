import { NextResponse } from 'next/server'
import { CreditsRepository } from '@/lib/repositories/CreditsRepository'

export async function POST() {
  try {
    const status = await CreditsRepository.useCredit()

    if (!status) {
      return NextResponse.json(
        { error: 'No credits available' },
        { status: 403 }
      )
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error('Error using credit:', error)
    return NextResponse.json(
      { error: 'Failed to use credit' },
      { status: 500 }
    )
  }
}
