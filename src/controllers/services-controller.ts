import { Request, Response } from "express"
import { AppError } from "@/utils/AppError"
import { prisma } from "@/database/prisma"
import { z } from "zod"

class ServicesController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(3),
      description: z.string().optional(),
      price: z.number().positive(),
    })

    const { name, description, price } = bodySchema.parse(request.body)

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
      },
    })

    if (request.user?.role !== "admin") {
      throw new AppError("Only admins can create services", 403)
    }

    return response.status(201).json(service)
  }

  async list(request: Request, response: Response) {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return response.json(services)
  }
}

export { ServicesController }

