import { FastifyInstance } from 'fastify';
import { generateBalanceProjectionUseCase } from '../composition/finance';
import { toProjectionPointDto } from '../mappers/projection-point.mapper';

interface ProjectionQuerystring {
  startDate: string;
  endDate: string;
}

export default async function (fastify: FastifyInstance) {
  fastify.get<{ Querystring: ProjectionQuerystring }>(
    '/projection',
    {
      schema: {
        querystring: {
          type: 'object',
          required: ['startDate', 'endDate'],
          properties: {
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
          },
        },
      },
    },
    async function (request, reply) {
      const startDate = new Date(request.query.startDate);
      const endDate = new Date(request.query.endDate);

      if (startDate > endDate) {
        return reply.badRequest('startDate must be before or equal to endDate');
      }

      const projection = await generateBalanceProjectionUseCase.execute({ startDate, endDate });

      return projection.map(toProjectionPointDto);
    },
  );
}
