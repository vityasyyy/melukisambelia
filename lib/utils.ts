import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAlternatingSpan(index: number, total: number): string | undefined {
  if (total <= 2) {
    return index === 0 ? 'sm:col-span-2 lg:col-span-2' : undefined
  }
  const row = Math.floor(index / 3)
  const posInRow = index % 3
  if (row % 2 === 0) {
    return posInRow === 0 ? 'sm:col-span-2 lg:col-span-2' : undefined
  }
  return posInRow === 2 ? 'sm:col-span-2 lg:col-span-2' : undefined
}

export function isAlternatingFeatured(index: number, total: number): boolean {
  if (total <= 2) return index === 0
  const row = Math.floor(index / 3)
  const posInRow = index % 3
  if (row % 2 === 0) return posInRow === 0
  return posInRow === 2
}
