import { describe, expect, it } from 'vitest';
import { GeneratePeriodChartDataUseCase } from './generate-period-chart-data.use-case';
import { GenerateBalanceProjectionUseCase } from '../generate-balance-projection/generate-balance-projection.use-case';
import { BalanceProjectionGenerator } from '../../../domain/balance-projection/balance-projection-generator';
import { InMemoryBalanceDataRepository } from '../../../infrastructure/repositories/in-memory-balance-data.repository';
import { BalanceMilestone } from '../../../domain/balance-milestone/balance-milestone';
import { CashVariation } from '../../../domain/cash-variation/cash-variation';
import { Money } from '../../../domain/money/money';

describe('GeneratePeriodChartDataUseCase', () => {
  it('should bundle the balance projection with the milestones and variations of the period', async () => {
    const anchorMilestone = new BalanceMilestone('m0', new Date('2024-12-01'), Money.fromEuros(1000));
    const milestoneInPeriod = new BalanceMilestone('m1', new Date('2025-01-02'), Money.fromEuros(1200));
    const cashVariation = new CashVariation('c1', new Date('2025-01-02'), Money.fromEuros(50), 'income', 'Bonus');
    const repository = new InMemoryBalanceDataRepository([anchorMilestone, milestoneInPeriod], [cashVariation], []);
    const useCase = new GeneratePeriodChartDataUseCase(
      repository,
      new GenerateBalanceProjectionUseCase(repository, new BalanceProjectionGenerator()),
    );

    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-01-03');
    const result = await useCase.execute({ startDate, endDate });

    expect(result.startDate).toBe(startDate);
    expect(result.endDate).toBe(endDate);
    expect(result.balanceProjection).toHaveLength(3);
    expect(result.balanceMilestones).toEqual([milestoneInPeriod]);
    expect(result.cashVariations).toEqual([cashVariation]);
    expect(result.dailyBalanceVariations).toEqual([]);
  });
});
