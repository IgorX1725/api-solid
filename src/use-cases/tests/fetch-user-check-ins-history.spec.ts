import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

beforeEach(async () => {
  checkInsRepository = new InMemoryCheckInsRepository()
  sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
})

describe('Fetch user checkIns history Use Case', () => {
  it('Should be able to fetch check-in history', async () => {
    type CreateCheckInInput = { gymId: string; user_id: string }
    const createCheckIn = async (data: CreateCheckInInput) => {
      await checkInsRepository.create(data)
    }

    for (let i = 1; i <= 3; i++) {
      createCheckIn({ gymId: `gym-${i}`, user_id: 'user-01' })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkIns).toHaveLength(3)
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-1' }),
      expect.objectContaining({ gymId: 'gym-2' }),
      expect.objectContaining({ gymId: 'gym-3' }),
    ])
  })

  it('Should be able to fetch paginated check-in history', async () => {
    type CreateCheckInInput = { gymId: string; user_id: string }
    const createCheckIn = (data: CreateCheckInInput) => {
      checkInsRepository.create(data)
    }
    for (let i = 1; i <= 22; i++) {
      createCheckIn({ gymId: `gym-${i}`, user_id: 'user-01' })
    }
    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-21' }),
      expect.objectContaining({ gymId: 'gym-22' }),
    ])
  })
})
