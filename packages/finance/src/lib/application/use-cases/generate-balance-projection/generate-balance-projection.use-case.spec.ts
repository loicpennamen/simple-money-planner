import { describe, expect, it } from 'vitest';
import { GenerateBalanceProjectionUseCase } from './generate-balance-projection.use-case';
import { InMemoryBalanceDataRepository } from '../../../infrastructure/repositories/in-memory-balance-data.repository';
import { BalanceMilestone } from '../../../domain/balance-milestone/balance-milestone';
import { DailyBalanceVariation } from '../../../domain/daily-balance-variation/daily-balance-variation';
import { Money } from '../../../domain/money/money';

describe('GenerateBalanceProjectionUseCase', () => {
  it('should generate balance projection', async () => {
    const repository = new InMemoryBalanceDataRepository(
      [new BalanceMilestone('m1', new Date('2025-01-01'), Money.fromEuros(1000))],
      [],
      [
        new DailyBalanceVariation(
          'd1',
          new Date('2025-01-01'),
          new Date('2025-01-03'),
          Money.fromEuros(-10),
          'Daily cost',
        ),
      ],
    );
    const useCase = new GenerateBalanceProjectionUseCase(repository);
    const result = await useCase.execute({ startDate: new Date('2025-01-01'), endDate: new Date('2025-01-03') });

    expect(result).toHaveLength(3);
    expect(result[0].balance.toNumber()).toBe(990);
    expect(result[2].balance.toNumber()).toBe(970);
  });
});
