import { expect, describe, it, beforeEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'
import { ResourceNotFoundError } from '../errors/resource-not-fount-error'
import { afterEach } from 'node:test'
import { LateCheckInValidationError } from '../errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

beforeEach(async () => {
  checkInsRepository = new InMemoryCheckInsRepository()
  sut = new ValidateCheckInUseCase(checkInsRepository)

  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Validate Check-in Use Case', () => {
  it('Should be able to validate the check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('Should not be able to validate an inexistent check in', async () => {
    const checkInAction = async () => {
      await sut.execute({
        checkInId: 'Inexistent check-in id',
      })
    }

    expect(checkInAction).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should not be able to validate the check in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2024, 10, 7, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    const checkInAction = async () => {
      await sut.execute({
        checkInId: createdCheckIn.id,
      })
    }

    expect(checkInAction).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
