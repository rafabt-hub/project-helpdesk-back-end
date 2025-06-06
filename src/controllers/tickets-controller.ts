import { Request, Response } from "express"

class TicketsController {
  create(request: Request, response: Response) {
    return response.json({ message: "ok" })
  }
}

export { TicketsController }