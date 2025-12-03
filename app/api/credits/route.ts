import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CreditsRepository } from '@/lib/repositories/CreditsRepository'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Session token is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const repository = new CreditsRepository(supabase)

    // Get or create session
    await repository.getOrCreateSession(token)
    const status = await repository.getStatus(token)

    return NextResponse.json(status)
  } catch (error) {
    console.error('Error fetching credit status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credit status' },
      { status: 500 }
    )
  }
}
