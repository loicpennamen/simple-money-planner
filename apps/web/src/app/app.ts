import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BalanceChart, BalancePoint } from './balance-chart/balance-chart';

// TODO switchable dates
// const PERIOD_START = '2024-12-01'; // should return error
const PERIOD_START = '2025-01-01';
const PERIOD_END = '2025-03-31';

@Component({
  imports: [BalanceChart],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.sass',
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly periodStartLabel = formatDateToEnglish(PERIOD_START);
  protected readonly periodEndLabel = formatDateToEnglish(PERIOD_END);

  protected readonly projection = resource({
    loader: () =>
      firstValueFrom(
        // TODO centralize APIs endpoints
        this.http.get<BalancePoint[]>('/api/projection', {
          params: { startDate: PERIOD_START, endDate: PERIOD_END },
        }),
      ),
  });

  protected readonly errorMessage = computed(() => {
    const error = this.projection.error();
    return error instanceof HttpErrorResponse ? (error.error?.message ?? error.message) : String(error);
  });
}

/** @deprecated - TODO create automatic date formatting as pipes depending on i18n locale **/
function formatDateToEnglish(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}
