import { FastifyInstance } from 'fastify';
import { generateBalanceProjectionUseCase } from '../composition/finance';
import { toProjectionPointDto } from '../mappers/projection-point.mapper';

export default async function (fastify: FastifyInstance) {
  fastify.get('/projection', async function () {
    const projection = await generateBalanceProjectionUseCase.execute({
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-05'),
    });

    return projection.map(toProjectionPointDto);
  });
}
