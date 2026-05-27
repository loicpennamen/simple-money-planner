import { describe, expect, it } from 'vitest';
import { BalanceMilestone } from '../balance-milestone/balance-milestone';
import { BalanceProjection } from './balance-projection';
import { BalanceProjectionGenerator } from './balance-projection-generator';
import { DailyBalanceVariation } from '../daily-balance-variation/daily-balance-variation';
import { Money } from '../money/money';

describe('BalanceProjectionGenerator', () => {
  it('should generate coherent daily projection points', () => {
    const milestone = new BalanceMilestone('m1', new Date('2025-01-01'), Money.fromEuros(1000));
    const dailyVariation = new DailyBalanceVariation(
      'd1',
      new Date('2025-01-01'),
      new Date('2025-01-03'),
      Money.fromEuros(-10),
      'Daily cost',
    );
    const projection = new BalanceProjection(milestone, [], [dailyVariation]);
    const generator = new BalanceProjectionGenerator();
    const points = generator.generateDailyProjection(projection, new Date('2025-01-01'), new Date('2025-01-03'));

    expect(points).toHaveLength(3);
    expect(points[0].balance.toNumber()).toBe(990);
    expect(points[1].balance.toNumber()).toBe(980);
    expect(points[2].balance.toNumber()).toBe(970);
  });
});
