import { PeriodChartData } from '@simple-money-planner/finance';
import { PeriodChartDataDto } from '../dto/period-chart-data.dto';
import { toProjectionPointDto } from './projection-point.mapper';

export function toPeriodChartDataDto(data: PeriodChartData): PeriodChartDataDto {
  return {
    startDate: data.startDate.toISOString(),
    endDate: data.endDate.toISOString(),
    balanceProjection: data.balanceProjection.map(toProjectionPointDto),
    balanceMilestones: data.balanceMilestones.map((milestone) => ({
      id: milestone.id,
      date: milestone.date.toISOString(),
      balance: milestone.balance.toNumber(),
      note: milestone.note,
    })),
    cashVariations: data.cashVariations.map((variation) => ({
      id: variation.id,
      date: variation.date.toISOString(),
      amount: variation.amount.toNumber(),
      type: variation.type,
      label: variation.label,
    })),
    dailyBalanceVariations: data.dailyBalanceVariations.map((variation) => ({
      id: variation.id,
      startDate: variation.startDate.toISOString(),
      endDate: variation.endDate.toISOString(),
      dailyAmount: variation.dailyAmount.toNumber(),
      label: variation.label,
    })),
  };
}
