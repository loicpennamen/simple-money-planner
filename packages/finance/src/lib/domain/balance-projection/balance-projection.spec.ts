import { describe, expect, it } from 'vitest';

import { BalanceMilestone } from '../balance-milestone/balance-milestone';
import { BalanceProjection } from './balance-projection';
import { CashVariation } from '../cash-movement/cash-variation';
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
});
