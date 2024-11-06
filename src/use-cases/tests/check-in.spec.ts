import { expect, describe, it, beforeEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from '../check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach } from 'node:test'
import { MaxNumberOfCheckInsError } from '../errors/max-number-of-check-ins-error'
import { MaxDistanceError } from '../errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase
let gymsRepository: InMemoryGymsRepository

beforeEach(async () => {
  checkInsRepository = new InMemoryCheckInsRepository()
  gymsRepository = new InMemoryGymsRepository()
  sut = new CheckInUseCase(checkInsRepository, gymsRepository)

  await gymsRepository.create({
    id: 'gym-01',
    title: 'New Gym',
    description: '',
    latitude: 0,
    longitude: 0,
  })

  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Check-in Use Case', () => {
  it('Should be able to check in', async () => {
    const { checkIn } = await sut.create({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in twice in a day', async () => {
    const checkInRegister = async () =>
      await sut.create({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      })

    await checkInRegister()

    expect(checkInRegister).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('Should be able to check in once in different days', async () => {
    const checkInRegister = async () =>
      await sut.create({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      })
    vi.setSystemTime(new Date(2024, 10, 6, 0, 0))
    await checkInRegister()

    vi.setSystemTime(new Date(2024, 10, 7, 0, 0))
    const { checkIn } = await checkInRegister()

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in out of gym range', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'New Gym 2',
      description: '',
      latitude: new Decimal(-22.817088),
      longitude: new Decimal(-47.063723),
      phone: '99999999',
      created_at: new Date(),
    })

    const checkInRegister = async () =>
      await sut.create({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -22.816896,
        userLongitude: -47.068231,
      })

    expect(checkInRegister).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
