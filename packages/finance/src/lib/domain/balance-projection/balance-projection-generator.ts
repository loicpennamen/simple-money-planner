import { BalanceProjection } from './balance-projection';
import { ProjectionPoint } from '../projection-point/projection-point';

export class BalanceProjectionGenerator {
  generateDailyProjection(projection: BalanceProjection, startDate: Date, endDate: Date): ProjectionPoint[] {
    const points: ProjectionPoint[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      points.push(new ProjectionPoint(new Date(currentDate), projection.balanceAt(currentDate)));

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return points;
  }
}
