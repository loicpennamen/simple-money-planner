import { Currency } from "../currency/currency";

export class Money {
  private constructor(
    private readonly cents: number,
    private readonly currency: Currency = Currency.EUR,
  ) {}

  static fromEuros(amount: number): Money {
    return new Money(Math.round(amount * 100), Currency.EUR);
  }

  static fromCents(cents: number): Money {
    return new Money(cents, Currency.EUR);
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);

    return new Money(
      this.cents + other.cents,
      this.currency,
    );
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);

    return new Money(
      this.cents - other.cents,
      this.currency,
    );
  }

  equals(other: Money): boolean {
    return (
      this.cents === other.cents &&
      this.currency === other.currency
    );
  }

  invert(): Money {
    return new Money(
      this.cents * -1,
      this.currency,
    );
  }

  multiply(factor: number): Money {
    return new Money(
      this.cents * factor,
      this.currency,
    );
  }

  isNegative(): boolean {
    return this.cents < 0;
  }

  toNumber(): number {
    return this.cents / 100;
  }

  toString(): string {
    return `${this.toNumber().toFixed(2)} ${this.currency}`;
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error('Currency mismatch');
    }
  }
}
