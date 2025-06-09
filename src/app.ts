import express from "express"
import "express-async-errors"
import * as path from "path"

import { routes } from "./routes"
import { errorHandling } from "./middlewares/error-handling"
import { uploadsRoutes } from "./routes/uploads-routes"

const app = express()

app.use(express.json())
app.use(routes)
app.use("/uploads", uploadsRoutes)

app.use(errorHandling)

export { app }
