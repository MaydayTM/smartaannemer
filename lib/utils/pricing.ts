import type { ProjectType, BuildingType, PriceEstimate } from '@/types/lead.types'

/**
 * Calculate price estimate based on project parameters
 * Uses simplified estimation model for MVP
 */
export function calculateEstimate(
  projectType: ProjectType,
  buildingType: BuildingType,
  yearBuilt: number | null
): PriceEstimate {
  // Base prices per project type (in EUR)
  const basePrices: Record<ProjectType, { min: number; max: number }> = {
    roof: { min: 12000, max: 35000 },
    facade: { min: 8000, max: 25000 },
    insulation: { min: 5000, max: 18000 },
    solar: { min: 6000, max: 15000 },
    combo: { min: 20000, max: 50000 },
  }

  // Building type multipliers
  const buildingMultipliers: Record<BuildingType, number> = {
    row: 1.0,
    semi_detached: 1.15,
    detached: 1.3,
    apartment: 0.8,
  }

  // Age factor (older = more expensive)
  const currentYear = new Date().getFullYear()
  const age = yearBuilt ? currentYear - yearBuilt : 30
  const ageFactor = age > 50 ? 1.2 : age > 30 ? 1.1 : 1.0

  const base = basePrices[projectType]
  const multiplier = buildingMultipliers[buildingType] * ageFactor

  const min = Math.round(base.min * multiplier)
  const max = Math.round(base.max * multiplier)

  // Calculate breakdown (rough estimates)
  const materialsPercent = 0.4
  const laborPercent = 0.35
  const scaffoldingPercent = projectType === 'roof' || projectType === 'facade' ? 0.15 : 0.05
  const insulationPercent = projectType === 'insulation' || projectType === 'combo' ? 0.1 : 0.05

  return {
    min,
    max,
    currency: 'EUR',
    breakdown: {
      materials: [Math.round(min * materialsPercent), Math.round(max * materialsPercent)],
      labor: [Math.round(min * laborPercent), Math.round(max * laborPercent)],
      scaffolding: [Math.round(min * scaffoldingPercent), Math.round(max * scaffoldingPercent)],
      insulation: [Math.round(min * insulationPercent), Math.round(max * insulationPercent)],
    },
  }
}

/**
 * Format price as EUR currency
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format price range
 */
export function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} - ${formatPrice(max)}`
}
