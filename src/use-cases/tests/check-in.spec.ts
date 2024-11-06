import { expect, describe, it, beforeEach, vi } from 'vitest'
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

  it('Should not be able to check in twice in a day', async () => {
    const checkInRegister = async () =>
      await sut.create({
        gymId: 'gym-01',
        userId: 'user-01',
      })

    await checkInRegister()

    expect(checkInRegister).rejects.toBeInstanceOf(Error)
  })

  it('Should be able to check in once in different days', async () => {
    const checkInRegister = async () =>
      await sut.create({
        gymId: 'gym-01',
        userId: 'user-01',
      })
    vi.setSystemTime(new Date(2024, 10, 6, 0, 0))
    await checkInRegister()

    vi.setSystemTime(new Date(2024, 10, 7, 0, 0))
    const { checkIn } = await checkInRegister()

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
