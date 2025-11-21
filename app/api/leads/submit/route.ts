import { NextRequest, NextResponse } from 'next/server'
import { LeadsRepository } from '@/lib/repositories/LeadsRepository'
import { ContractorsRepository } from '@/lib/repositories/ContractorsRepository'
import { CreditsRepository } from '@/lib/repositories/CreditsRepository'
import { calculateEstimate } from '@/lib/utils/pricing'
import type { CreateLeadInput } from '@/types/lead.types'
import type { MatchCriteria } from '@/types/contractor.types'

export async function POST(request: NextRequest) {
  try {
    // Check if user has credits
    const creditStatus = await CreditsRepository.getStatus()
    if (!creditStatus.canUseCredit) {
      return NextResponse.json(
        { error: 'No credits available' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      formData,
      contactInfo,
    } = body

    // Calculate estimate
    const estimate = calculateEstimate(
      formData.projectType,
      formData.buildingType,
      formData.yearBuilt
    )

    // Find matching contractors
    const matchCriteria: MatchCriteria = {
      region: formData.city, // Simplified: use city as region
      projectType: formData.projectType,
      budgetMin: formData.budgetRange[0],
      budgetMax: formData.budgetRange[1],
      priority: formData.priority,
    }

    const contractors = await ContractorsRepository.findMatching(matchCriteria)

    // Use a credit BEFORE creating the lead to prevent race conditions
    // where a lead is created but credit usage fails
    const creditResult = await CreditsRepository.useCredit()

    if (!creditResult) {
      return NextResponse.json(
        { error: 'Failed to use credit' },
        { status: 500 }
      )
    }

    // TODO: For production, implement a credit refund mechanism in case
    // lead creation fails after credit usage. Consider using database
    // transactions or a two-phase commit pattern.

    // Create lead input
    const leadInput: CreateLeadInput = {
      ...formData,
      ...contactInfo,
      estimate,
      matchedContractorIds: contractors.map((c) => c.id),
      source: 'web',
    }

    // Save lead to database
    const lead = await LeadsRepository.create(leadInput)

    if (!lead) {
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      )
    }

    // Return results
    return NextResponse.json({
      success: true,
      estimate,
      contractors,
      leadId: lead.id,
    })
  } catch (error) {
    console.error('Error submitting lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
