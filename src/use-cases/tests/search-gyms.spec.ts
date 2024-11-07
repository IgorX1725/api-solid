import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from '../search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

beforeEach(async () => {
  gymsRepository = new InMemoryGymsRepository()
  sut = new SearchGymsUseCase(gymsRepository)
})

describe('Search gyms Use Case', () => {
  it('Should be able to search for gyms by title', async () => {
    await gymsRepository.create({
      title: 'Gym-test-first',
      latitude: -22.817088,
      longitude: -47.063723,
    })

    await gymsRepository.create({
      title: 'Gym-test-second',
      description: 'Gym-test-second description',
      latitude: -22.817088,
      longitude: -47.063723,
    })

    const { gyms } = await sut.execute({
      query: 'gym',
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym-test-first' }),
      expect.objectContaining({ title: 'Gym-test-second' }),
    ])
  })

  it('Should be able to search for gyms by description', async () => {
    await gymsRepository.create({
      title: 'Gym-test-first',
      latitude: -22.817088,
      longitude: -47.063723,
    })

    await gymsRepository.create({
      title: 'Gym-test-second',
      description: 'Gym-test-second description',
      latitude: -22.817088,
      longitude: -47.063723,
    })

    const { gyms } = await sut.execute({
      query: 'description',
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ description: 'Gym-test-second description' }),
    ])
  })

  it('Should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym-test-${i}`,
        latitude: -22.817088,
        longitude: -47.063723,
      })
    }
    const { gyms } = await sut.execute({
      query: 'gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym-test-21' }),
      expect.objectContaining({ title: 'Gym-test-22' }),
    ])
  })
})
