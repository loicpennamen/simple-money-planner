import { BalanceDataRepository } from '../../application/ports/balance-data.repository';
import { BalanceMilestone } from '../../domain/balance-milestone/balance-milestone';
import { CashVariation } from '../../domain/cash-variation/cash-variation';
import { DailyBalanceVariation } from '../../domain/daily-balance-variation/daily-balance-variation';

export class InMemoryBalanceDataRepository implements BalanceDataRepository {
  constructor(
    private readonly milestones: BalanceMilestone[],
    private readonly cashVariations: CashVariation[],
    private readonly dailyVariations: DailyBalanceVariation[],
  ) {}

  async getLatestMilestoneBefore(date: Date): Promise<BalanceMilestone | null> {
    const validMilestones = this.milestones
      .filter((milestone) => milestone.date <= date)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    return validMilestones[0] ?? null;
  }

  async getCashVariationsBetween(startDate: Date, endDate: Date): Promise<CashVariation[]> {
    return this.cashVariations.filter((variation) => variation.date >= startDate && variation.date <= endDate);
  }

  async getDailyVariationsOverlapping(startDate: Date, endDate: Date): Promise<DailyBalanceVariation[]> {
    return this.dailyVariations.filter((variation) => variation.endDate >= startDate && variation.startDate <= endDate);
  }
}
