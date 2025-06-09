import { Router } from "express"
import { ServicesController } from "@/controllers/services-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"

const servicesRoutes = Router()
const servicesController = new ServicesController()

servicesRoutes.get("/", ensureAuthenticated, servicesController.list)
servicesRoutes.post("/", ensureAuthenticated, servicesController.create)

export { servicesRoutes }