import { Money } from '../money/money';

export type CashVariationType =
  | 'income'
  | 'expense';

export class CashVariation {
  constructor(
    public readonly id: string,
    public readonly date: Date,
    public readonly amount: Money,
    public readonly type: CashVariationType,
    public readonly label: string,
  ) {}

  signedAmount(): Money {
    return this.type === 'expense'
      ? this.amount.invert()
      : this.amount;
  }
}
