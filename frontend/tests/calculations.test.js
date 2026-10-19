import { describe, it, expect } from 'vitest';
import {
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTotal,
} from '../src/utils/calculations';

describe('CafePulse Financial Calculations', () => {
  it('calculates subtotal accurately across multiple cart items', () => {
    const items = [
      { price: 4.5, quantity: 2 }, // 9.00
      { price: 3.25, quantity: 1 }, // 3.25
      { price: 6.0, quantity: 3 }, // 18.00
    ];
    expect(calculateSubtotal(items)).toBe(30.25);
  });

  it('handles percentage discounts properly', () => {
    expect(calculateDiscount(100, 'percent', 15)).toBe(15.0);
    expect(calculateDiscount(55.5, 'percent', 10)).toBe(5.55);
    expect(calculateDiscount(50, 'percent', 120)).toBe(50.0); // Clamped at 100%
  });

  it('handles fixed amount discounts without exceeding subtotal', () => {
    expect(calculateDiscount(25.5, 'fixed', 5)).toBe(5.0);
    expect(calculateDiscount(10.0, 'fixed', 20)).toBe(10.0); // Clamped at subtotal
  });

  it('calculates tax accurately on taxable amount', () => {
    expect(calculateTax(50, 8.5)).toBe(4.25);
    expect(calculateTax(0, 10)).toBe(0);
  });

  it('computes full order breakdown with discount and tax', () => {
    const items = [
      { price: 5.0, quantity: 2 }, // 10.00
      { price: 10.0, quantity: 1 }, // 10.00 -> subtotal 20.00
    ];
    // 10% discount on 20.00 -> 2.00 discount -> 18.00 taxable
    // 5% tax on 18.00 -> 0.90 tax -> total 18.90
    const result = calculateTotal({
      items,
      discountType: 'percent',
      discountValue: 10,
      taxRate: 5,
    });

    expect(result.subtotal).toBe(20.0);
    expect(result.discountAmount).toBe(2.0);
    expect(result.taxableAmount).toBe(18.0);
    expect(result.taxAmount).toBe(0.9);
    expect(result.total).toBe(18.9);
  });
});
