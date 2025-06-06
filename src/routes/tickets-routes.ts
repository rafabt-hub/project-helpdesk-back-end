import { Router } from "express"

import { TicketsController } from "@/controllers/tickets-controller"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const ticketsRoutes = Router()
const ticketsController = new TicketsController()

ticketsRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin", "client"]))
ticketsRoutes.post("/", ticketsController.create)

export { ticketsRoutes }