import { BalanceDataRepository } from '../../ports/balance-data.repository';
import { GenerateBalanceProjectionUseCase } from '../generate-balance-projection/generate-balance-projection.use-case';
import { PeriodChartData } from './period-chart-data';

export interface GeneratePeriodChartDataCommand {
  startDate: Date;
  endDate: Date;
}

export class GeneratePeriodChartDataUseCase {
  constructor(
    private readonly repository: BalanceDataRepository,
    private readonly balanceProjectionUseCase: GenerateBalanceProjectionUseCase,
  ) {}

  async execute(command: GeneratePeriodChartDataCommand): Promise<PeriodChartData> {
    const [balanceProjection, balanceMilestones, cashVariations, dailyBalanceVariations] = await Promise.all([
      this.balanceProjectionUseCase.execute(command),
      this.repository.getMilestonesBetween(command.startDate, command.endDate),
      this.repository.getCashVariationsBetween(command.startDate, command.endDate),
      this.repository.getDailyVariationsOverlapping(command.startDate, command.endDate),
    ]);

    return new PeriodChartData(
      command.startDate,
      command.endDate,
      balanceProjection,
      balanceMilestones,
      cashVariations,
      dailyBalanceVariations,
    );
  }
}
