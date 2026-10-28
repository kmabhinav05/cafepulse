/**
 * CafePulse Financial & POS Calculations
 * Strict precision logic to avoid floating-point rounding errors
 */

export function calculateSubtotal(items = []) {
  const sum = items.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return acc + price * qty;
  }, 0);
  return Number(sum.toFixed(2));
}

export function calculateDiscount(subtotal = 0, discountType = 'none', discountValue = 0) {
  const sub = Math.max(0, Number(subtotal) || 0);
  const val = Math.max(0, Number(discountValue) || 0);

  if (discountType === 'percent') {
    const clampedPercent = Math.min(100, val);
    const amount = (sub * clampedPercent) / 100;
    return Number(amount.toFixed(2));
  } else if (discountType === 'fixed') {
    const amount = Math.min(sub, val);
    return Number(amount.toFixed(2));
  }
  return 0;
}

export function calculateTax(taxableAmount = 0, taxRate = 10) {
  const amount = Math.max(0, Number(taxableAmount) || 0);
  const rate = Math.max(0, Number(taxRate) || 0);
  const tax = (amount * rate) / 100;
  return Number(tax.toFixed(2));
}

export function calculateTotal({
  items = [],
  discountType = 'none',
  discountValue = 0,
  taxRate = 10,
}) {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscount(subtotal, discountType, discountValue);
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = calculateTax(afterDiscount, taxRate);
  const total = Number((afterDiscount + taxAmount).toFixed(2));

  return {
    subtotal,
    discountAmount,
    taxableAmount: afterDiscount,
    taxAmount,
    total,
  };
}

/**
 * Format amounts into Indian Rupee format (₹)
 */
export function formatINR(amount = 0) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(num);
}

