import { Router } from "express"

import { usersRoutes } from "./users-routes"
import { sessionsRoutes } from "./sessions-routes"
import { ticketsRoutes } from "./tickets-routes"

const routes = Router()
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/tickets", ticketsRoutes)

export { routes }