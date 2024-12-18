import { makeSearchGymUseCase } from '@/use-cases/factories/make-search-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const search = async (request: FastifyRequest, reply: FastifyReply) => {
  const searchGymBodySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchGymBodySchema.parse(request.query)

  const searchGymUseCase = makeSearchGymUseCase()

  const { gyms } = await searchGymUseCase.execute({
    query: q,
    page,
  })

  return reply.status(200).send({ gyms })
}
