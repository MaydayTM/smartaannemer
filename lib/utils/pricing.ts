import { ProjectType, BuildingType, PriceEstimate } from '@/types/lead.types'

// Base prices per project type (EUR)
const BASE_PRICES: Record<ProjectType, [number, number]> = {
  roof: [8000, 25000],
  facade: [6000, 20000],
  insulation: [4000, 15000],
  solar: [5000, 12000],
  combo: [15000, 45000],
}

// Building type multipliers
const BUILDING_MULTIPLIERS: Record<BuildingType, number> = {
  apartment: 0.7,
  row: 0.85,
  semi_detached: 1.0,
  detached: 1.3,
}

// Age-based adjustments (older buildings cost more)
function getAgeMultiplier(yearBuilt: number | null): number {
  if (!yearBuilt) return 1.0

  const age = new Date().getFullYear() - yearBuilt

  if (age < 10) return 0.9
  if (age < 30) return 1.0
  if (age < 50) return 1.15
  if (age < 80) return 1.25
  return 1.4
}

// Cost breakdown percentages
const BREAKDOWN_PERCENTAGES = {
  materials: 0.40,
  labor: 0.35,
  scaffolding: 0.15,
  insulation: 0.10,
}

export function calculateEstimate(
  projectType: ProjectType,
  buildingType: BuildingType,
  yearBuilt: number | null
): PriceEstimate {
  const [baseMin, baseMax] = BASE_PRICES[projectType]
  const buildingMultiplier = BUILDING_MULTIPLIERS[buildingType]
  const ageMultiplier = getAgeMultiplier(yearBuilt)

  const totalMultiplier = buildingMultiplier * ageMultiplier

  const min = Math.round(baseMin * totalMultiplier / 100) * 100
  const max = Math.round(baseMax * totalMultiplier / 100) * 100

  // Calculate breakdown
  const breakdown = {
    materials: [
      Math.round(min * BREAKDOWN_PERCENTAGES.materials),
      Math.round(max * BREAKDOWN_PERCENTAGES.materials),
    ] as [number, number],
    labor: [
      Math.round(min * BREAKDOWN_PERCENTAGES.labor),
      Math.round(max * BREAKDOWN_PERCENTAGES.labor),
    ] as [number, number],
    scaffolding: [
      Math.round(min * BREAKDOWN_PERCENTAGES.scaffolding),
      Math.round(max * BREAKDOWN_PERCENTAGES.scaffolding),
    ] as [number, number],
    insulation: [
      Math.round(min * BREAKDOWN_PERCENTAGES.insulation),
      Math.round(max * BREAKDOWN_PERCENTAGES.insulation),
    ] as [number, number],
  }

  return {
    min,
    max,
    currency: 'EUR',
    breakdown,
  }
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} - ${formatPrice(max)}`
}
