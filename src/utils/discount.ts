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
    // 5x 349 kr (1 745 kr) -> 1 490 kr (298 kr/stk, spar 255 kr)
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
    // 3x 349 kr (1 047 kr) -> 990 kr (spar 57 kr)
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
        percent: 15
      }
    };
  }

  if (singleQty === 2 && singleSubtotal > 0) {
    return {
      percent: 0,
      amount: 0,
      tierLabel: 'Ordinær pris',
      nextTier: {
        requiredQuantity: 3,
        remaining: 1,
        percent: 5
      }
    };
  }

  return {
    percent: 0,
    amount: 0,
    tierLabel: 'Ordinær pris',
    nextTier: {
      requiredQuantity: 3,
      remaining: Math.max(0, 3 - singleQty),
      percent: 5
    }
  };
}
