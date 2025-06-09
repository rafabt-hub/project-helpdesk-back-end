import { Router } from "express"

import { usersRoutes } from "./users-routes"
import { sessionsRoutes } from "./sessions-routes"
import { servicesRoutes } from "./services-routes"
import { ticketsRoutes } from "./tickets-routes"
import { uploadsRoutes } from "./uploads-routes"


const routes = Router()
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/tickets", ticketsRoutes)
routes.use("/services", servicesRoutes)
routes.use("/uploads", uploadsRoutes)

export { routes }