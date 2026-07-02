import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAlternatingSpan(index: number, total: number): string | undefined {
  if (total <= 2) return undefined
  const groupIndex = Math.floor(index / 3)
  const posInGroup = index % 3
  const isEvenGroup = groupIndex % 2 === 0
  if (isEvenGroup) {
    if (posInGroup === 0) return 'sm:col-span-2 lg:col-span-2 lg:row-span-2'
    return undefined
  }
  if (posInGroup === 2) return 'sm:col-span-2 lg:col-span-2 lg:row-span-2'
  return undefined
}

export function isAlternatingFeatured(index: number, total: number): boolean {
  if (total <= 2) return index === 0
  const groupIndex = Math.floor(index / 3)
  const posInGroup = index % 3
  const isEvenGroup = groupIndex % 2 === 0
  if (isEvenGroup) return posInGroup === 0
  return posInGroup === 2
}