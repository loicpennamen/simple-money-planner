import { ProjectionPoint } from '@simple-money-planner/finance';
import { ProjectionPointDto } from '../dto/projection-point.dto';

export function toProjectionPointDto(point: ProjectionPoint): ProjectionPointDto {
  return {
    date: point.date.toISOString(),
    balance: point.balance.toNumber(),
  };
}
