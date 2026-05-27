import { Money } from '../money/money';

export class BalanceMilestone {
  constructor(
    public readonly id: string,
    public readonly date: Date,
    public readonly balance: Money,
    public readonly note?: string,
  ) {}
}
