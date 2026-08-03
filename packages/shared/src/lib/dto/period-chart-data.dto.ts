import { ProjectionPointDto } from './projection-point.dto';

export interface BalanceMilestoneDto {
  id: string;
  date: string;
  balance: number;
  note?: string;
}

export interface CashVariationDto {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  label: string;
}

export interface DailyBalanceVariationDto {
  id: string;
  startDate: string;
  endDate: string;
  dailyAmount: number;
  label: string;
}

export interface PeriodChartDataDto {
  startDate: string;
  endDate: string;
  balanceProjection: ProjectionPointDto[];
  balanceMilestones: BalanceMilestoneDto[];
  cashVariations: CashVariationDto[];
  dailyBalanceVariations: DailyBalanceVariationDto[];
}
