import { z } from 'zod'

/**
 * Validation schema for Lead Finder form
 */
export const leadFinderFormSchema = z.object({
  // Address fields
  address: z.string().min(5, 'Adres moet minimaal 5 karakters bevatten'),
  postalCode: z.string().regex(/^\d{4}$/, 'Postcode moet 4 cijfers bevatten'),
  city: z.string().min(2, 'Stad moet minimaal 2 karakters bevatten'),

  // Project details
  projectType: z.enum(['roof', 'facade', 'insulation', 'solar', 'combo']),
  buildingType: z.enum(['row', 'semi_detached', 'detached', 'apartment']),
  yearBuilt: z
    .number()
    .min(1900, 'Bouwjaar moet na 1900 zijn')
    .max(new Date().getFullYear(), 'Bouwjaar kan niet in de toekomst liggen')
    .nullable(),
  urgency: z.enum(['1-3m', '3-6m', '6-12m', 'exploring']),
  budgetRange: z.tuple([z.number().min(0), z.number().min(0)]),
  priority: z.enum(['price', 'balance', 'quality']),
})

/**
 * Validation schema for contact information
 */
export const contactInfoSchema = z.object({
  firstName: z.string().min(2, 'Voornaam moet minimaal 2 karakters bevatten'),
  lastName: z.string().min(2, 'Achternaam moet minimaal 2 karakters bevatten'),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z
    .string()
    .regex(/^(\+32|0)[1-9]\d{7,8}$/, 'Ongeldig Belgisch telefoonnummer')
    .optional()
    .or(z.literal('')),
  extraInfo: z.string().max(500, 'Maximaal 500 karakters').optional(),
})

export type LeadFinderFormData = z.infer<typeof leadFinderFormSchema>
export type ContactInfoData = z.infer<typeof contactInfoSchema>
