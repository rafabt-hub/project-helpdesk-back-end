import { Router } from "express"

import { TicketsController } from "@/controllers/tickets-controller"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"

const ticketsRoutes = Router()
const ticketsController = new TicketsController()

ticketsRoutes.use(ensureAuthenticated)
ticketsRoutes.post("/", ticketsController.create)

export { ticketsRoutes }