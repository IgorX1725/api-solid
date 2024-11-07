import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

beforeEach(async () => {
  checkInsRepository = new InMemoryCheckInsRepository()
  sut = new GetUserMetricsUseCase(checkInsRepository)
})

describe('get user metrics Use Case', () => {
  it('Should be able to fetch check-in history', async () => {
    type CreateCheckInInput = { gymId: string; user_id: string }
    const createCheckIn = async (data: CreateCheckInInput) => {
      await checkInsRepository.create(data)
    }

    for (let i = 1; i <= 3; i++) {
      createCheckIn({ gymId: `gym-${i}`, user_id: 'user-01' })
    }

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(3)
  })
})
