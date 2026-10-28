import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes cleanly with clsx conditional syntax
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
