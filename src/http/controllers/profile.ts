import { FastifyReply, FastifyRequest } from 'fastify'

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.jwtVerify()

  return reply.status(200).send()
}
