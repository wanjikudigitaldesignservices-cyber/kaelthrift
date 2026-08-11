import { z } from 'zod';

// ============================================================
// Product Validation Schema
// ============================================================

export const CATEGORIES = [
  'dresses',
  'tops',
  'jeans',
  'shoes',
  'bags',
  'accessories',
] as const;

export const CONDITIONS = ['New with tags', 'Excellent', 'Good'] as const;

export const STATUSES = ['available', 'reserved', 'sold'] as const;

export const measurementsSchema = z.object({
  bust: z.string().optional().default(''),
  waist: z.string().optional().default(''),
  length: z.string().optional().default(''),
  hips: z.string().optional().default(''),
  inseam: z.string().optional().default(''),
  shoulders: z.string().optional().default(''),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(200, 'Product name must be under 200 characters')
    .trim(),
  category: z.enum(['dresses', 'tops', 'jeans', 'shoes', 'bags', 'accessories']),
  size: z
    .string()
    .min(1, 'Size is required')
    .max(20, 'Size must be under 20 characters')
    .trim(),
  price: z
    .number()
    .positive('Price must be greater than 0')
    .max(999999, 'Price seems too high'),
  condition: z.enum(['New with tags', 'Excellent', 'Good']),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative')
    .default(1),
  measurements: measurementsSchema.optional(),
  description: z
    .string()
    .max(2000, 'Description must be under 2000 characters')
    .optional()
    .default(''),
  status: z.enum(['available', 'reserved', 'sold']).default('available'),
  images: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required'),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ============================================================
// Login Validation Schema
// ============================================================

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================
// Contact/Inquiry Schema (minimal PII — Kenya DPA compliant)
// ============================================================

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100)
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be under 1000 characters')
    .trim(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
