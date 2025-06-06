import { Router } from "express"

import { TicketsController } from "@/controllers/tickets-controller"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const ticketsRoutes = Router()
const ticketsController = new TicketsController()

ticketsRoutes.use(ensureAuthenticated)
ticketsRoutes.post("/", verifyUserAuthorization(["client","admin"]), ticketsController.create)
ticketsRoutes.get("/", verifyUserAuthorization(["admin", "technician", "client"]), ticketsController.index)
ticketsRoutes.get("/:id", verifyUserAuthorization(["admin", "technician", "client"]), ticketsController.show)
ticketsRoutes.patch("/:id/status", verifyUserAuthorization(["admin", "technician"]), 
ticketsController.updateStatus)
ticketsRoutes.delete("/:id", verifyUserAuthorization(["admin", "client"]), ticketsController.delete)

export { ticketsRoutes }