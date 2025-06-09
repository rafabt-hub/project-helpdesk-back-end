import { Request, Response } from "express"
import { AppError } from "@/utils/AppError"
import { prisma } from "@/database/prisma"
import { hash } from "bcrypt"
import { z } from "zod"

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(3),
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { name, email, password } = bodySchema.parse(request.body)

    const userWithSameEmail = await prisma.user.findFirst({ where: { email }})

    if (userWithSameEmail) {
      throw new AppError("User with same email already exists")
    }

    const hashedPassword = await hash(password, 8)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    const { password: _, ...userWithoutPassword } = user

    return response.status(201).json(userWithoutPassword)
  }

  async list(request: Request, response: Response) {
  type Role = "admin" | "technician" | "client"
  const validRoles: Role[] = ["admin", "technician", "client"]

  const roleParam = request.query.role as string | undefined

  const filter = roleParam && validRoles.includes(roleParam as Role)
    ? { role: roleParam as Role }
    : {}

  const users = await prisma.user.findMany({
    where: filter,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })

  return response.json(users)
 }
}

export { UsersController }