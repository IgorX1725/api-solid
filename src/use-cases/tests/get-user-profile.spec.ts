import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'
import { ResourceNotFoundError } from '../errors/resource-not-fount-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

beforeEach(async () => {
  usersRepository = new InMemoryUsersRepository()
  sut = new GetUserProfileUseCase(usersRepository)
})

describe('Get User Profile Use Case', () => {
  it('Should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('Should not be able to get user profile with wrong id', async () => {
    const authenticateUser = sut.execute({
      userId: 'non-existing-id',
    })

    await expect(authenticateUser).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
