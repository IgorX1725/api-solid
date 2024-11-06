import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface CheckInCaseRequest {
  userId: string
  gymId: string
}
interface CheckInCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async create({
    userId,
    gymId,
  }: CheckInCaseRequest): Promise<CheckInCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
