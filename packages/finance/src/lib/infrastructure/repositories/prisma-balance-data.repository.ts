import { PrismaClient } from '@prisma/client';
import { BalanceDataRepository } from '../../application/ports/balance-data.repository';
import { BalanceMilestone } from '../../domain/balance-milestone/balance-milestone';
import { CashVariation } from '../../domain/cash-variation/cash-variation';
import { DailyBalanceVariation } from '../../domain/daily-balance-variation/daily-balance-variation';
import { Money } from '../../domain/money/money';

export class PrismaBalanceDataRepository implements BalanceDataRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getLatestMilestoneBefore(date: Date): Promise<BalanceMilestone | null> {
    const model = await this.prisma.balanceMilestone.findFirst({
      where: {
        date: {
          lte: date,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    if (!model) {
      return null;
    }

    return new BalanceMilestone(model.id, model.date, Money.fromCents(model.amount), model.note ?? undefined);
  }

  async getCashVariationsBetween(startDate: Date, endDate: Date): Promise<CashVariation[]> {
    const models = await this.prisma.cashVariation.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return models.map(
      (model) =>
        new CashVariation(
          model.id,
          model.date,
          Money.fromCents(model.amount),
          model.type as 'income' | 'expense',
          model.label,
        ),
    );
  }

  async getDailyVariationsOverlapping(startDate: Date, endDate: Date): Promise<DailyBalanceVariation[]> {
    const models = await this.prisma.dailyBalanceVariation.findMany({
      where: {
        endDate: {
          gte: startDate,
        },
        startDate: {
          lte: endDate,
        },
      },
    });

    return models.map(
      (model) =>
        new DailyBalanceVariation(
          model.id,
          model.startDate,
          model.endDate,
          Money.fromCents(model.dailyAmount),
          model.label,
        ),
    );
  }
}
