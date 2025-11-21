import { createClient } from '@/lib/supabase/server'
import type { CreateLeadInput, Lead } from '@/types/lead.types'
import { calculateEstimate } from '@/lib/utils/pricing'

/**
 * Repository for lead operations
 * Handles lead creation and retrieval
 */
export class LeadsRepository {
  /**
   * Create a new lead in the database
   */
  static async create(input: CreateLeadInput): Promise<Lead | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('leads')
      .insert({
        // Contact info
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        phone: input.phone,
        // Address
        address: input.address,
        postal_code: input.postalCode,
        city: input.city,
        // Project details
        project_type: input.projectType,
        building_type: input.buildingType,
        year_built: input.yearBuilt,
        urgency: input.urgency,
        budget_min: input.budgetRange[0],
        budget_max: input.budgetRange[1],
        priority: input.priority,
        extra_info: input.extraInfo,
        // Estimate
        estimate_min: input.estimate.min,
        estimate_max: input.estimate.max,
        estimate_currency: input.estimate.currency,
        // Matching
        matched_contractor_ids: input.matchedContractorIds,
        chosen_contractor_id: input.chosenContractorId,
        // Metadata
        source: input.source || 'web',
        status: 'new',
      })
      .select()
      .single()

    if (error || !data) {
      console.error('Error creating lead:', error)
      return null
    }

    return this.mapDatabaseToLead(data)
  }

  /**
   * Map database row to Lead type
   */
  private static mapDatabaseToLead(row: any): Lead {
    // Recalculate estimate breakdown from project parameters
    // Breakdown values are not stored in database to avoid data duplication
    const calculatedEstimate = calculateEstimate(
      row.project_type,
      row.building_type,
      row.year_built
    )

    return {
      id: row.id,
      createdAt: row.created_at,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      postalCode: row.postal_code,
      city: row.city,
      projectType: row.project_type,
      buildingType: row.building_type,
      yearBuilt: row.year_built,
      urgency: row.urgency,
      budgetRange: [row.budget_min, row.budget_max],
      priority: row.priority,
      extraInfo: row.extra_info,
      estimate: {
        min: row.estimate_min,
        max: row.estimate_max,
        currency: row.estimate_currency,
        breakdown: calculatedEstimate.breakdown,
      },
      matchedContractorIds: row.matched_contractor_ids || [],
      chosenContractorId: row.chosen_contractor_id,
      source: row.source,
      status: row.status,
      notes: row.notes,
    }
  }
}
