import { describe, expect, it } from 'vitest';

import { BalanceMilestone } from '../balance-milestone/balance-milestone';
import { BalanceProjection } from './balance-projection';
import { CashVariation } from '../cash-variation/cash-variation';
import { DailyBalanceVariation } from '../daily-balance-variation/daily-balance-variation';
import { Money } from '../money/money';

describe('BalanceProjection', () => {
  it('should compute projected balance from milestone, cash variations and daily variations', () => {
    const milestone = new BalanceMilestone('m1', new Date('2025-01-01'), Money.fromEuros(1000));
    const salary = new CashVariation('c1', new Date('2025-01-05'), Money.fromEuros(2000), 'income', 'Salary');
    const groceries = new CashVariation('c2', new Date('2025-01-10'), Money.fromEuros(100), 'expense', 'Groceries');
    const dailyLifeCost = new DailyBalanceVariation(
      'd1',
      new Date('2025-01-01'),
      new Date('2025-01-10'),
      Money.fromEuros(-30),
      'Daily life',
    );
    const projection = new BalanceProjection(milestone, [salary, groceries], [dailyLifeCost]);
    const result = projection.balanceAt(new Date('2025-01-10'));

    expect(result.toNumber()).toBe(2600);
  });

  it('should throw error if target date is before milestone date', () => {
    const milestone = new BalanceMilestone('m1', new Date('2025-01-10'), Money.fromEuros(1000));
    const projection = new BalanceProjection(milestone, [], []);

    expect(() => projection.balanceAt(new Date('2025-01-01'))).toThrow();
  });

  it('should ignore cash variations outside projection interval', () => {
    const milestone = new BalanceMilestone('m1', new Date('2025-01-10'), Money.fromEuros(1000));
    const ignoredPastVariation = new CashVariation(
      'c1',
      new Date('2025-01-01'),
      Money.fromEuros(500),
      'income',
      'Ignored past income',
    );
    const ignoredFutureVariation = new CashVariation(
      'c2',
      new Date('2025-01-20'),
      Money.fromEuros(500),
      'income',
      'Ignored future income',
    );
    const validVariation = new CashVariation(
      'c3',
      new Date('2025-01-15'),
      Money.fromEuros(200),
      'income',
      'Valid income',
    );
    const projection = new BalanceProjection(
      milestone,
      [ignoredPastVariation, ignoredFutureVariation, validVariation],
      [],
    );
    const result = projection.balanceAt(new Date('2025-01-15'));

    expect(result.toNumber()).toBe(1200);
  });

  it('should ignore daily variations outside projection interval', () => {
    const milestone = new BalanceMilestone('m1', new Date('2025-01-10'), Money.fromEuros(1000));
    const ignoredPastVariation = new DailyBalanceVariation(
      'd1',
      new Date('2025-01-01'),
      new Date('2025-01-05'),
      Money.fromEuros(-10),
      'Ignored past variation',
    );
    const ignoredFutureVariation = new DailyBalanceVariation(
      'd2',
      new Date('2025-01-20'),
      new Date('2025-01-30'),
      Money.fromEuros(-10),
      'Ignored future variation',
    );
    const validVariation = new DailyBalanceVariation(
      'd3',
      new Date('2025-01-10'),
      new Date('2025-01-15'),
      Money.fromEuros(-10),
      'Valid variation',
    );
    const projection = new BalanceProjection(
      milestone,
      [],
      [ignoredPastVariation, ignoredFutureVariation, validVariation],
    );
    const result = projection.balanceAt(new Date('2025-01-15'));

    // 6 days inclusive:
    // Jan 10,11,12,13,14,15
    expect(result.toNumber()).toBe(940);
  });
});
