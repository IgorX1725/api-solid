import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from '../check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

beforeEach(async () => {
  checkInsRepository = new InMemoryCheckInsRepository()
  sut = new CheckInUseCase(checkInsRepository)
})

describe('Check-in Use Case', () => {
  it('Should be able to check in', async () => {
    const { checkIn } = await sut.create({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
