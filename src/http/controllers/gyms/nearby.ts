import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const nearby = async (request: FastifyRequest, reply: FastifyReply) => {
  const nearbyGYmsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGYmsQuerySchema.parse(request.body)

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
