import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymsUseCase } from '../search-gyms'

export const makeSearchGymUseCase = () => {
  const prismaGymsRepository = new PrismaGymsRepository()
  const searchGymsUseCase = new SearchGymsUseCase(prismaGymsRepository)

  return searchGymsUseCase
}
