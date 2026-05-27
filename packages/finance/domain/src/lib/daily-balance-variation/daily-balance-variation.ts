import { Money } from '../money/money';

export class DailyBalanceVariation {
  constructor(
    public readonly id: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly dailyAmount: Money,
    public readonly label: string,
  ) {
    this.assertValidDateRange();
  }

  totalImpact(): Money {
    return this.dailyAmount.multiply(
      this.durationInDays(),
    );
  }

  private assertValidDateRange(): void {
    if (this.endDate < this.startDate) {
      throw new Error(
        'End date must be after start date',
      );
    }
  }

  private durationInDays(): number {
    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    return Math.floor(
      (
        this.endDate.getTime() -
        this.startDate.getTime()
      ) / millisecondsPerDay
    ) + 1;
  }

}
