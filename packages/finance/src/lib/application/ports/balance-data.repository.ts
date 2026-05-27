import { BalanceMilestone } from '../../domain/balance-milestone/balance-milestone';
import { CashVariation } from '../../domain/cash-variation/cash-variation';
import { DailyBalanceVariation } from '../../domain/daily-balance-variation/daily-balance-variation';

export interface BalanceDataRepository {
  getLatestMilestoneBefore(date: Date): Promise<BalanceMilestone | null>;

  getCashVariationsBetween(startDate: Date, endDate: Date): Promise<CashVariation[]>;

  getDailyVariationsOverlapping(startDate: Date, endDate: Date): Promise<DailyBalanceVariation[]>;
}
