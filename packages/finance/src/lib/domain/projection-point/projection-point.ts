import { Money } from '../money/money';

export class ProjectionPoint {
  constructor(
    public readonly date: Date,
    public readonly balance: Money,
  ) {}
}
