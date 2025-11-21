import { createClient } from '@/lib/supabase/server'
import type { Contractor, MatchCriteria } from '@/types/contractor.types'
import type { ProjectType } from '@/types/lead.types'

/**
 * Repository for contractor operations
 * Handles contractor matching and retrieval
 */
export class ContractorsRepository {
  /**
   * Find contractors matching the given criteria
   * Returns up to 3 contractors sorted by match quality
   */
  static async findMatching(criteria: MatchCriteria): Promise<Contractor[]> {
    const supabase = await createClient()

    // Build query based on project type
    let query = supabase
      .from('contractors')
      .select('*')
      .eq('verified', true)
      .eq('financially_healthy', true)

    // Filter by region if specified
    if (criteria.region) {
      query = query.eq('region', criteria.region)
    }

    // Filter by project type capability
    const projectTypeMap: Record<string, string> = {
      roof: 'offers_roof',
      facade: 'offers_facade',
      insulation: 'offers_insulation',
      solar: 'offers_solar',
    }

    if (criteria.projectType === 'combo') {
      // For combo projects, require all capabilities
      query = query
        .eq('offers_roof', true)
        .eq('offers_facade', true)
        .eq('offers_insulation', true)
    } else if (projectTypeMap[criteria.projectType]) {
      query = query.eq(projectTypeMap[criteria.projectType], true)
    }

    // Execute query
    const { data: contractors, error } = await query

    if (error) {
      console.error('Error fetching contractors:', error)
      return []
    }

    if (!contractors || contractors.length === 0) {
      return []
    }

    // Score and sort contractors
    const scored = contractors.map((contractor) => ({
      ...this.mapDatabaseToContractor(contractor),
      score: this.calculateMatchScore(contractor, criteria),
    }))

    // Sort by score and return top 3
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ score, ...contractor }) => contractor)
  }

  /**
   * Calculate match score for a contractor
   * Higher score = better match
   */
  private static calculateMatchScore(contractor: any, criteria: MatchCriteria): number {
    let score = 0

    // Base score for verified + financially healthy
    score += 100

    // Bonus for full premium guidance
    if (contractor.full_guidance_premiums) {
      score += 30
    }

    // Budget match score
    if (criteria.budgetMin && criteria.budgetMax) {
      const budgetMid = (criteria.budgetMin + criteria.budgetMax) / 2
      const contractorMin = contractor.avg_project_value_min || 0
      const contractorMax = contractor.avg_project_value_max || Infinity

      if (budgetMid >= contractorMin && budgetMid <= contractorMax) {
        score += 50
      }
    }

    // Rating score
    if (contractor.rating) {
      score += contractor.rating * 10
    }

    // Priority-based adjustments
    if (criteria.priority === 'quality' && contractor.rating > 4.5) {
      score += 20
    }

    return score
  }

  /**
   * Map database row to Contractor type
   */
  private static mapDatabaseToContractor(row: any): Contractor {
    return {
      id: row.id,
      name: row.name,
      city: row.city,
      region: row.region,
      website: row.website,
      email: row.email,
      phone: row.phone,
      verified: row.verified,
      financiallyHealthy: row.financially_healthy,
      fullGuidancePremiums: row.full_guidance_premiums,
      offersRoof: row.offers_roof,
      offersFacade: row.offers_facade,
      offersInsulation: row.offers_insulation,
      offersSolar: row.offers_solar,
      avgProjectValueMin: row.avg_project_value_min,
      avgProjectValueMax: row.avg_project_value_max,
      avgProjectsPerYear: row.avg_projects_per_year,
      rating: row.rating,
      notes: row.notes,
      createdAt: row.created_at,
    }
  }

  /**
   * Get contractor by ID
   */
  static async getById(id: string): Promise<Contractor | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('contractors')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return null
    }

    return this.mapDatabaseToContractor(data)
  }
}
