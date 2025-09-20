import { z } from 'zod'

export const authorFormSchema = z.object({
  first_name: z.string().min(1, 'Le prénom est requis').max(50, 'Maximum 50 caractères'),
  last_name: z.string().min(1, 'Le nom est requis').max(50, 'Maximum 50 caractères'),
  bio: z.string().optional(),
  website_url: z.string().url('URL invalide').optional().or(z.literal('')),
  socials: z.object({
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
  is_active: z.boolean().default(true),
})

export type AuthorFormData = z.infer<typeof authorFormSchema>