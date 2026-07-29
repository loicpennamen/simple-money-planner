import { GenerateBalanceProjectionUseCase } from '@simple-money-planner/finance';
import { BalanceProjectionGenerator } from '@simple-money-planner/finance';
import { InMemoryBalanceDataRepository } from '@simple-money-planner/finance';
import { BalanceMilestone } from '@simple-money-planner/finance';
import { DailyBalanceVariation } from '@simple-money-planner/finance';
import { Money } from '@simple-money-planner/finance';

const repository = new InMemoryBalanceDataRepository(
  [new BalanceMilestone('m1', new Date('2025-01-01'), Money.fromEuros(1000))],
  [],
  [
    new DailyBalanceVariation(
      'd1',
      new Date('2025-01-01'),
      new Date('2025-01-10'),
      Money.fromEuros(-10),
      'Cost of living',
    ),
  ],
);

const generator = new BalanceProjectionGenerator();

export const generateBalanceProjectionUseCase = new GenerateBalanceProjectionUseCase(repository, generator);
