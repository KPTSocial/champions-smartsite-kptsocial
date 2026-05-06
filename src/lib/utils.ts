
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined): string {
  // No price set (null, undefined, or 0) renders nothing on the public site
  if (amount == null || amount === 0 || Number.isNaN(amount)) {
    return '';
  }
  // Whole dollar amounts: $10 instead of $10.00
  if (amount % 1 === 0) {
    return `$${amount}`;
  }
  // Cents: $14.50
  return `$${amount.toFixed(2)}`;
}

export function hasPrice(amount: number | null | undefined): boolean {
  return amount != null && amount !== 0 && !Number.isNaN(amount);
}
