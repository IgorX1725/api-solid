import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

beforeEach(async () => {
  gymsRepository = new InMemoryGymsRepository()
  sut = new CreateGymUseCase(gymsRepository)
})

describe('Create gym Use Case', () => {
  it('Should be able to Create a gym', async () => {
    const { gym } = await sut.create({
      title: 'The top gym',
      latitude: -22.817088,
      longitude: -47.063723,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
