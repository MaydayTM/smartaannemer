import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ContractorsRepository } from '@/lib/repositories/ContractorsRepository'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectType, region, budgetMin, budgetMax, priority } = body

    if (!projectType) {
      return NextResponse.json(
        { error: 'Project type is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const repository = new ContractorsRepository(supabase)

    const contractors = await repository.match({
      projectType,
      region: region || 'België',
      budgetMin,
      budgetMax,
      priority: priority || 'balance',
    })

    return NextResponse.json({ contractors })
  } catch (error) {
    console.error('Error matching contractors:', error)
    return NextResponse.json(
      { error: 'Failed to match contractors' },
      { status: 500 }
    )
  }
}
