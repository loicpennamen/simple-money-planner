import { ProjectionPoint } from '../../../domain/projection-point/projection-point';
import { BalanceProjection } from '../../../domain/balance-projection/balance-projection';
import { BalanceProjectionGenerator } from '../../../domain/balance-projection/balance-projection-generator';
import { BalanceDataRepository } from '../../ports/balance-data.repository';

export interface GenerateBalanceProjectionCommand {
  startDate: Date;
  endDate: Date;
}

export class GenerateBalanceProjectionUseCase {
  private readonly generator = new BalanceProjectionGenerator();

  constructor(private readonly repository: BalanceDataRepository) {}

  async execute(command: GenerateBalanceProjectionCommand): Promise<ProjectionPoint[]> {
    const milestone = await this.repository.getLatestMilestoneBefore(command.startDate);

    if (!milestone) {
      throw new Error('No milestone found before projection start date');
    }

    const cashVariations = await this.repository.getCashVariationsBetween(milestone.date, command.endDate);
    const dailyVariations = await this.repository.getDailyVariationsOverlapping(milestone.date, command.endDate);
    const projection = new BalanceProjection(milestone, cashVariations, dailyVariations);

    return this.generator.generateDailyProjection(projection, command.startDate, command.endDate);
  }
}
