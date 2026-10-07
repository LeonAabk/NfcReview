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

export function calculateBulkDiscount(totalQuantity: number, subtotal: number): BulkDiscountResult {
  if (totalQuantity >= 10) {
    const percent = 20;
    return {
      percent,
      amount: Math.round((subtotal * percent) / 100),
      tierLabel: '20% Storkunde Bulk Deal (10+ varer)'
    };
  }

  if (totalQuantity >= 5) {
    const percent = 15;
    return {
      percent,
      amount: Math.round((subtotal * percent) / 100),
      tierLabel: '15% Bulk Deal (5+ varer)',
      nextTier: {
        requiredQuantity: 10,
        remaining: 10 - totalQuantity,
        percent: 20
      }
    };
  }

  if (totalQuantity >= 3) {
    const percent = 10;
    return {
      percent,
      amount: Math.round((subtotal * percent) / 100),
      tierLabel: '10% Kvantumsrabatt (3+ varer)',
      nextTier: {
        requiredQuantity: 5,
        remaining: 5 - totalQuantity,
        percent: 15
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
      percent: 10
    }
  };
}
