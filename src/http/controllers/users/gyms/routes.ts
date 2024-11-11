import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT)
}
