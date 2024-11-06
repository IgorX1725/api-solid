import { Prisma, User } from '@prisma/client'
import { PrismaUsersRepository } from '../prisma/prisma-users-repository'

export class InMemoryUsersRepository implements PrismaUsersRepository {
  public items: User[] = []
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-test-id-1',
      name: data.name,
      email: data.email,
      password: data.password,
      created_at: new Date(),
    }
    this.items.push(user)

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }
}
