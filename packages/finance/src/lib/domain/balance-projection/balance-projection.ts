import { BalanceMilestone } from '../balance-milestone/balance-milestone';
import { CashVariation } from '../cash-movement/cash-variation';
import { DailyBalanceVariation } from '../daily-balance-variation/daily-balance-variation';
import { Money } from '../money/money';

export class BalanceProjection {
  constructor(
    private readonly milestone: BalanceMilestone,
    private readonly cashVariations: CashVariation[],
    private readonly dailyVariations: DailyBalanceVariation[],
  ) {}

  // todo write tests for this
  balanceAt(date: Date): Money {
    // Calculating a balance requires an anterior or equal milestone to begin at
    if (this.milestone.date > date) {
      throw new Error('Can not get balance: An anterior milestone is required.');
    }

    let balance = this.milestone.balance;

    // Add or remove cash based on registered outcome | income in the corresponding period of time
    const cashVariationsInInterval = this.cashVariations.filter(
      // todo write tests to check this filter
      (cashVariation) => cashVariation.date >= this.milestone.date && cashVariation.date <= date,
    );
    for (const cashVariation of cashVariationsInInterval) {
      balance = balance.add(cashVariation.signedAmount());
    }

    // Add or remove cash based on recurring daily outcome | income in the corresponding period of time
    const overlappingDailyVariations = this.dailyVariations.filter(
      // todo write tests to check this filter
      (variation) => variation.endDate >= this.milestone.date && variation.startDate <= date,
    );
    for (const variation of overlappingDailyVariations) {
      const effectiveStartDate = variation.startDate < date ? variation.startDate : date;
      const effectiveEndDate = variation.endDate > date ? date : variation.endDate;
      const days = this.daysBetween(effectiveStartDate, effectiveEndDate);

      balance = balance.add(variation.dailyAmount.multiply(days));
    }

    return balance;
  }

  private daysBetween(start: Date, end: Date): number {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    return Math.floor((end.getTime() - start.getTime()) / millisecondsPerDay) + 1;
  }
}
