
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  // Handle whole dollar amounts: $10 instead of $10.00
  if (amount % 1 === 0) {
    return `$${amount}`;
  }
  // Handle cents: $14.50
  return `$${amount.toFixed(2)}`;
}
