import { expect, describe, it, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { RegisterUseCase } from '../register'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

beforeEach(async () => {
  usersRepository = new InMemoryUsersRepository()
  sut = new RegisterUseCase(usersRepository)
})

describe('Register Use Case', () => {
  it('Should be able to register an user successfully', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Should not be able to register a new user with a existent email ', async () => {
    const registerUser = async () => {
      await sut.execute({
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
      })
    }

    await registerUser()

    await expect(registerUser).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
