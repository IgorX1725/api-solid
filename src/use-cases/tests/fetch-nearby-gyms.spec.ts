import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

beforeEach(async () => {
  gymsRepository = new InMemoryGymsRepository()
  sut = new FetchNearbyGymsUseCase(gymsRepository)
})

describe('Fetch Nearby Gyms Use Case', () => {
  it('Should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -22.8984855,
      longitude: -47.0596907,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -22.564451,
      longitude: -47.403216,
    })

    const { gyms } = await sut.execute({
      userLatitude: -22.9104349,
      userLongitude: -47.0619265,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
