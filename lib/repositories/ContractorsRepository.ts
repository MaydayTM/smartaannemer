import { SupabaseClient } from '@supabase/supabase-js'
import { Contractor, MatchCriteria } from '@/types/contractor.types'
import { ProjectType } from '@/types/lead.types'

export class ContractorsRepository {
  constructor(private supabase: SupabaseClient) {}

  private getProjectTypeColumn(projectType: string): string {
    const mapping: Record<string, string> = {
      roof: 'offers_roof',
      facade: 'offers_facade',
      insulation: 'offers_insulation',
      solar: 'offers_solar',
      combo: 'offers_roof', // For combo, we check roof but show all that match any
    }
    return mapping[projectType] || 'offers_roof'
  }

  async match(criteria: MatchCriteria): Promise<Contractor[]> {
    const projectColumn = this.getProjectTypeColumn(criteria.projectType)

    let query = this.supabase
      .from('contractors')
      .select('*')
      .eq('verified', true)
      .eq(projectColumn, true)
      .order('rating', { ascending: false })
      .limit(3)

    // Optional: filter by region if provided
    if (criteria.region && criteria.region !== 'België') {
      query = query.ilike('region', `%${criteria.region}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error matching contractors:', error)
      return []
    }

    return (data || []).map(this.mapToContractor)
  }

  async getById(id: string): Promise<Contractor | null> {
    const { data, error } = await this.supabase
      .from('contractors')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return null
    }

    return this.mapToContractor(data)
  }

  async getAll(): Promise<Contractor[]> {
    const { data, error } = await this.supabase
      .from('contractors')
      .select('*')
      .eq('verified', true)
      .order('rating', { ascending: false })

    if (error) {
      console.error('Error fetching contractors:', error)
      return []
    }

    return (data || []).map(this.mapToContractor)
  }

  private mapToContractor(data: Record<string, unknown>): Contractor {
    return {
      id: data.id as string,
      name: data.name as string,
      city: data.city as string,
      region: data.region as string,
      website: data.website as string | undefined,
      email: data.email as string | undefined,
      phone: data.phone as string | undefined,
      verified: data.verified as boolean,
      financiallyHealthy: data.financially_healthy as boolean,
      fullGuidancePremiums: data.full_guidance_premiums as boolean,
      offersRoof: data.offers_roof as boolean,
      offersFacade: data.offers_facade as boolean,
      offersInsulation: data.offers_insulation as boolean,
      offersSolar: data.offers_solar as boolean,
      avgProjectValueMin: data.avg_project_value_min as number | undefined,
      avgProjectValueMax: data.avg_project_value_max as number | undefined,
      avgProjectsPerYear: data.avg_projects_per_year as number | undefined,
      rating: data.rating as number | undefined,
      notes: data.notes as string | undefined,
      createdAt: data.created_at as string,
    }
  }
}
