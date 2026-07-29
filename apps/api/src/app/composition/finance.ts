import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { GenerateBalanceProjectionUseCase } from '@simple-money-planner/finance';
import { BalanceProjectionGenerator } from '@simple-money-planner/finance';
import { PrismaBalanceDataRepository } from '@simple-money-planner/finance';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
const prisma = new PrismaClient({ adapter });
const repository = new PrismaBalanceDataRepository(prisma);
const generator = new BalanceProjectionGenerator();

export const generateBalanceProjectionUseCase = new GenerateBalanceProjectionUseCase(repository, generator);
