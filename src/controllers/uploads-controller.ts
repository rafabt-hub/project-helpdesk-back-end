import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { DiskStorage } from "@/providers/disk-storage"
import { AppError } from "@/utils/AppError"

class UploadsController {
  async update(request: Request, response: Response) {
    const user = request.user!

    if (!request.file) {
      throw new AppError("File is required")
    }

    const diskStorage = new DiskStorage()

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!userData) {
      throw new AppError("User not found", 404)
    }

    if (userData.profileImage) {
      await diskStorage.deleteFile(userData.profileImage, "upload")
    }

    const filename = await diskStorage.saveFile(request.file.filename)

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        profileImage: filename,
      },
    })

    const { password: _, ...userWithoutPassword } = updatedUser

    return response.json(userWithoutPassword)
  }
}

export { UploadsController }