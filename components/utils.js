/**
 * cn() — class name utility.
 *
 * Merges Tailwind classes intelligently: deduplicates conflicting utilities
 * (e.g. "p-2 p-4" → "p-4") and drops falsy values.
 *
 * Used in all custom components. Install deps if adding custom components:
 *   npm install clsx tailwind-merge
 *
 * Usage: cn('base-class', isActive && 'active-class', className)
 */
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
