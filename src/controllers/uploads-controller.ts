import { Request, Response } from "express"
import { DiskStorage } from "@/providers/disk-storage"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

class UploadsController {
  async uploadProfileImage(request: Request, response: Response) {
    if (!request.file) {
      throw new AppError("No file uploaded", 400)
    }

    const diskStorage = new DiskStorage()

    const filename = await diskStorage.saveFile(request.file.filename)

    await prisma.user.update({
      where: { id: request.user!.id },
      data: { profileImage: filename }
    })

    return response.status(200).json({ profileImage: filename })
  }
}

export { UploadsController }