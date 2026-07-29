import { Component, DestroyRef, effect, ElementRef, inject, input, viewChild } from '@angular/core';
import {
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

export interface BalancePoint {
  date: string;
  balance: number;
}

@Component({
  selector: 'app-balance-chart',
  templateUrl: './balance-chart.html',
  host: { class: 'block h-80 w-full' },
})
export class BalanceChart {
  readonly points = input.required<readonly BalancePoint[]>();

  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private chart?: Chart;

  constructor() {
    effect(() => {
      const canvas = this.canvasRef()?.nativeElement;
      const points = this.points();
      if (canvas) {
        this.renderChart(canvas, points);
      }
    });

    inject(DestroyRef).onDestroy(() => this.chart?.destroy());
  }

  private renderChart(canvas: HTMLCanvasElement, points: readonly BalancePoint[]): void {
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const primaryColor = readCssColor(canvas, '--color-primary', '#2563eb');

    this.chart?.destroy();
    this.chart = new Chart(context, {
      type: 'line',
      data: {
        labels: points.map((point) => formatShortDate(point.date)),
        datasets: [
          {
            label: 'Solde',
            data: points.map((point) => point.balance),
            borderColor: primaryColor,
            backgroundColor: hexToRgba(primaryColor, 0.12),
            fill: true,
            tension: 0.25,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: { ticks: { maxTicksLimit: 12, autoSkip: true } },
          y: { ticks: { callback: (value) => `${value} €` } },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => ` ${(item.parsed.y as number).toFixed(2)} €`,
            },
          },
        },
      },
    });
  }
}

// Todo use a locale-dependent method
function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit' }).format(new Date(iso));
}

function readCssColor(element: Element, variable: string, fallback: string): string {
  const value = getComputedStyle(element).getPropertyValue(variable).trim();
  return value || fallback;
}

function hexToRgba(hex: string, alpha: number): string {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!match) {
    return hex;
  }
  const [r, g, b] = match.slice(1).map((channel) => parseInt(channel, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
