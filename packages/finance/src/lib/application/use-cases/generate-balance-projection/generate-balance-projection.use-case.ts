import { BalanceProjection } from '../../../domain/balance-projection/balance-projection';
import { BalanceProjectionGenerator } from '../../../domain/balance-projection/balance-projection-generator';
import { CashVariation } from '../../../domain/cash-variation/cash-variation';
import { DailyBalanceVariation } from '../../../domain/daily-balance-variation/daily-balance-variation';
import { BalanceMilestone } from '../../../domain/balance-milestone/balance-milestone';
import { ProjectionPoint } from '../../../domain/projection-point/projection-point';

export interface GenerateBalanceProjectionCommand {
  milestone: BalanceMilestone;
  cashVariations: CashVariation[];
  dailyVariations: DailyBalanceVariation[];
  startDate: Date;
  endDate: Date;
}

export class GenerateBalanceProjectionUseCase {
  private readonly generator = new BalanceProjectionGenerator();

  execute(command: GenerateBalanceProjectionCommand): ProjectionPoint[] {
    const projection = new BalanceProjection(command.milestone, command.cashVariations, command.dailyVariations);

    return this.generator.generateDailyProjection(projection, command.startDate, command.endDate);
  }
}
