import { FastifyInstance } from 'fastify';
import { ApiEndpoints } from '@simple-money-planner/shared';
import { generatePeriodChartDataUseCase } from '../composition/finance';
import { toPeriodChartDataDto } from '../mappers/period-chart-data.mapper';

interface PeriodChartDataQuerystring {
  startDate: string;
  endDate: string;
}

export default async function (fastify: FastifyInstance) {
  fastify.get<{ Querystring: PeriodChartDataQuerystring }>(
    ApiEndpoints.PeriodChartData,
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

      const periodChartData = await generatePeriodChartDataUseCase.execute({ startDate, endDate });

      return toPeriodChartDataDto(periodChartData);
    },
  );
}
