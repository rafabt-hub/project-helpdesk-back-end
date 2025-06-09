import { Request, Response } from "express"
import { AppError } from "@/utils/AppError"
import { prisma } from "@/database/prisma"
import { z } from "zod"


class TicketsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      description: z.string(),
      services: z.array(z.string().uuid()).nonempty("Select at least one service."),
      technicianId: z.string().uuid().optional(),
    })

    const { description, services, technicianId } = bodySchema.parse(request.body)
    const user = request.user!

    if (user.role !== "client") {
      throw new AppError("Only clients can create tickets", 403)
    }

    const client = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true }
    })

    if (!client) {
      throw new AppError("Client not found", 404)
    }

    const foundServices = await prisma.service.findMany({
      where: { id: { in: services } },
      select: { id: true }
    })

    if (foundServices.length !== services.length) {
      throw new AppError("One or more services are invalid", 400)
    }

    const ticket = await prisma.ticket.create({
      data: {
        title: `Chamado de ${client.name}`,
        description,
        clientId: user.id,
        services: {
          create: services.map(serviceId => ({
            serviceId,
            addedById: user.id,
          }))
        }
      },
      include: {
        client: { select: { id: true, name: true } },
        services: {
          include: {
            service: { select: { id: true, name: true, price: true } }
          }
        }
      }
    })

    return response.status(201).json(ticket)
  }

  async index(request: Request, response: Response) {
    const user = request.user!;

    let where = {};
    if (user.role === "client") {
      where = { clientId: user.id };
    } else if (user.role === "technician") {
      where = { technicianId: user.id };
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        services: {
          include: {
            service: true,
            addedBy: {
              select: { id: true, name: true },
            },
          },
        },
        client: {
          select: { id: true, name: true },
        },
        technician: {
          select: { id: true, name: true },
        },
      },
    });

    return response.json(tickets);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const user = request.user!;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        services: {
          include: {
            service: true,
            addedBy: {
              select: { id: true, name: true },
            },
          },
        },
        client: {
          select: { id: true, name: true },
        },
        technician: {
          select: { id: true, name: true },
        },
      },
    });

    if (!ticket) throw new AppError("Ticket not found.", 404);

    const isOwner = ticket.clientId === user.id;
    const isTechnician = ticket.technicianId === user.id;

    if (user.role === "client" && !isOwner) {
      throw new AppError("You do not have permission to access this ticket.", 403);
    }

    if (user.role === "technician" && !isTechnician) {
      throw new AppError("You do not have permission to access this ticket.", 403);
    }

    return response.json(ticket);
  }

  async updateStatus(request: Request, response: Response) {
    const { id } = request.params;
    const statusSchema = z.object({
      status: z.enum(["open", "in_progress", "closed"]),
    });

    const { status } = statusSchema.parse(request.body);
    const user = request.user!;

    const ticket = await prisma.ticket.findUnique({ where: { id } });

    if (!ticket) throw new AppError("Ticket not found.", 404);

    const isTechnician = ticket.technicianId === user.id;

    if (user.role === "technician" && !isTechnician) {
      throw new AppError("You can only change tickets assigned to you.", 403);
    }

    await prisma.ticket.update({
      where: { id },
      data: { status },
    });

    return response.json({ message: "Status updated successfully." });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const user = request.user!;

    const ticket = await prisma.ticket.findUnique({ where: { id } });

    if (!ticket) throw new AppError("Ticket not found", 404);

    const isOwner = ticket.clientId === user.id;

    if (user.role === "client" && !isOwner) {
      throw new AppError("You cannot delete this ticket.", 403);
    }

    await prisma.ticket.delete({ where: { id } });

    return response.status(204).send();
  }
}

export { TicketsController }