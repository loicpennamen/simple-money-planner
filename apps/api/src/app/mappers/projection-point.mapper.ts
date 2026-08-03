import { ProjectionPoint } from '@simple-money-planner/finance';
import { ProjectionPointDto } from '@simple-money-planner/shared';

export function toProjectionPointDto(point: ProjectionPoint): ProjectionPointDto {
  return {
    date: point.date.toISOString(),
    balance: point.balance.toNumber(),
  };
}
