import { HttpClient } from '@angular/common/http';
import { Component, inject, resource } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

const PROJECTION_QUERY_PARAMS = {
  startDate: '2025-01-01',
  endDate: '2025-01-10',
};

@Component({
  imports: [JsonPipe],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.sass',
})
export class App {
  private readonly http = inject(HttpClient);

  protected readonly projection = resource({
    loader: () => firstValueFrom(this.http.get('/api/projection', { params: PROJECTION_QUERY_PARAMS })),
  });
}
