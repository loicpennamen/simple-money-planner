import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, resource, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiEndpoints, PeriodChartDataDto } from '@simple-money-planner/shared';
import { BalanceChart } from './balance-chart/balance-chart';
import { Alert } from './alert/alert';

const DEFAULT_PERIOD_START = '2025-01-01';
const DEFAULT_PERIOD_END = '2025-01-31';

@Component({
  imports: [BalanceChart, Alert],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.sass',
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly periodStart = signal(DEFAULT_PERIOD_START);
  protected readonly periodEnd = signal(DEFAULT_PERIOD_END);

  protected readonly periodChartData = resource({
    params: () => ({ startDate: this.periodStart(), endDate: this.periodEnd() }),
    loader: ({ params }) => firstValueFrom(this.http.get<PeriodChartDataDto>(ApiEndpoints.PeriodChartData, { params })),
  });

  protected readonly errorMessage = computed(() => {
    const error = this.periodChartData.error();
    return error instanceof HttpErrorResponse ? (error.error?.message ?? error.message) : String(error);
  });

  protected onPeriodStartChange(event: Event): void {
    this.periodStart.set((event.target as HTMLInputElement).value);
  }

  protected onPeriodEndChange(event: Event): void {
    this.periodEnd.set((event.target as HTMLInputElement).value);
  }
}
