import { CartItem } from '../types';

export interface BulkDiscountResult {
  percent: number;
  amount: number;
  tierLabel: string;
  nextTier?: {
    requiredQuantity: number;
    remaining: number;
    percent: number;
  };
}

export const FREE_SHIPPING_THRESHOLD = 500;
export const STANDARD_SHIPPING_FEE = 59;

/**
 * Calculates automatic bundle-aligned discount when customers add multiple single cards
 * (3 single cards -> 990 kr like Synlighetspakken, 5 single cards -> 1 490 kr like Bedriftspakken),
 * while keeping pre-discounted multi-packs at their exact listed prices.
 */
export function calculateCartDiscount(items: CartItem[]): BulkDiscountResult {
  const singleItems = items.filter(
    (item) => !item.product.disableBulkDiscount && !item.product.comingSoon
  );
  const singleQty = singleItems.reduce((sum, item) => sum + item.quantity, 0);
  const singleSubtotal = singleItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (singleQty >= 5 && singleSubtotal > 0) {
    // Aligns 5x 399 kr (1 995 kr) -> 1 490 kr (298 kr/stk, -101 kr per card)
    const targetTotal = singleQty * 298;
    const amount = Math.max(0, singleSubtotal - targetTotal);
    const percent = Math.round((amount / singleSubtotal) * 100);
    return {
      percent,
      amount,
      tierLabel: `Bedriftsrabatt (${singleQty} stk · 298 kr/stk)`
    };
  }

  if (singleQty >= 3 && singleSubtotal > 0) {
    // Aligns 3x 399 kr (1 197 kr) -> 990 kr (330 kr/stk, -69 kr per card)
    const targetTotal = singleQty * 330;
    const amount = Math.max(0, singleSubtotal - targetTotal);
    const percent = Math.round((amount / singleSubtotal) * 100);
    return {
      percent,
      amount,
      tierLabel: `Pakkerabatt – Synlighetspakken (${singleQty} stk · 330 kr/stk)`,
      nextTier: {
        requiredQuantity: 5,
        remaining: 5 - singleQty,
        percent: 25
      }
    };
  }

  if (singleQty > 0) {
    return {
      percent: 0,
      amount: 0,
      tierLabel: '',
      nextTier: {
        requiredQuantity: 3,
        remaining: 3 - singleQty,
        percent: 17
      }
    };
  }

  return {
    percent: 0,
    amount: 0,
    tierLabel: ''
  };
}

export function calculateBulkDiscount(totalQuantity: number, subtotal: number): BulkDiscountResult {
  if (totalQuantity >= 5 && subtotal > 0) {
    const amount = Math.round(subtotal * 0.2531);
    return {
      percent: 25,
      amount,
      tierLabel: 'Bedriftsrabatt (5+ stk)'
    };
  }

  if (totalQuantity >= 3 && subtotal > 0) {
    const amount = Math.round(subtotal * 0.1729);
    return {
      percent: 17,
      amount,
      tierLabel: 'Pakkerabatt (3+ stk)',
      nextTier: {
        requiredQuantity: 5,
        remaining: 5 - totalQuantity,
        percent: 25
      }
    };
  }

  return {
    percent: 0,
    amount: 0,
    tierLabel: '',
    nextTier: {
      requiredQuantity: 3,
      remaining: 3 - totalQuantity,
      percent: 17
    }
  };
}
