import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../check-in'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export const makeCheckInUseCase = () => {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const prismaGymsRepository = new PrismaGymsRepository()
  const checkInUseCase = new CheckInUseCase(
    prismaCheckInsRepository,
    prismaGymsRepository,
  )

  return checkInUseCase
}
