import { BalanceMilestone } from '../../../domain/balance-milestone/balance-milestone';
import { CashVariation } from '../../../domain/cash-variation/cash-variation';
import { DailyBalanceVariation } from '../../../domain/daily-balance-variation/daily-balance-variation';
import { ProjectionPoint } from '../../../domain/projection-point/projection-point';

/**
 * Display-oriented bundle of everything a chart needs to render a period: the
 * projected balance plus the raw events (milestones, cash variations, daily
 * variations) that occurred within that period. Not a domain object — it
 * exists purely to serve the UI layer.
 */
export class PeriodChartData {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly balanceProjection: ProjectionPoint[],
    public readonly balanceMilestones: BalanceMilestone[],
    public readonly cashVariations: CashVariation[],
    public readonly dailyBalanceVariations: DailyBalanceVariation[],
  ) {}
}
