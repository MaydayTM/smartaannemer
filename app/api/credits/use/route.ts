import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CreditsRepository } from '@/lib/repositories/CreditsRepository'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Session token is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const repository = new CreditsRepository(supabase)

    await repository.useCredit(token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error using credit:', error)

    if (error instanceof Error && error.message === 'No credits available') {
      return NextResponse.json(
        { error: 'No credits available' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to use credit' },
      { status: 500 }
    )
  }
}
