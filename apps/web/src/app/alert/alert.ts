import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

export enum AlertLevel {
  Debug,
  Info,
  Warning,
  Error,
}

const ALERT_LEVEL_CLASSES: Record<AlertLevel, string> = {
  [AlertLevel.Debug]: 'border-outline bg-surface-muted text-slate-500',
  [AlertLevel.Info]: 'border-primary/30 bg-primary/5 text-primary',
  [AlertLevel.Warning]: 'border-warning/30 bg-warning/5 text-warning',
  [AlertLevel.Error]: 'border-negative/30 bg-negative/5 text-negative',
};

@Component({
  selector: 'app-alert',
  imports: [NgClass],
  templateUrl: './alert.html',
  styleUrl: './alert.sass',
})
export class Alert {
  readonly level = input<AlertLevel>(AlertLevel.Error);

  protected classes = computed(() => ALERT_LEVEL_CLASSES[this.level()]);
}
