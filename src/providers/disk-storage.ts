import multer from "multer"
import path from "node:path"
import crypto from "node:crypto"
import fs from "node:fs"
import uploadConfig from "@/configs/uploads"

export class DiskStorage {
  async saveFile(file: string) {
    const tmpPath = path.resolve(uploadConfig.TMP_FOLDER, file)
    const uploadPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)

    await fs.promises.rename(tmpPath, uploadPath)

    return file
  }

  async deleteFile(file: string, type: "tmp" | "upload") {
    const folderPath = type === "tmp" ? uploadConfig.TMP_FOLDER : uploadConfig.UPLOADS_FOLDER
    const filePath = path.resolve(folderPath, file)

    try {
      await fs.promises.stat(filePath)
      await fs.promises.unlink(filePath)
    } catch {
      // Se arquivo não existir, ignora
    }
  }
}

export const multerUpload = multer({
  storage: multer.diskStorage({
    destination: uploadConfig.TMP_FOLDER,
    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex")
      const fileName = `${fileHash}-${file.originalname}`
      callback(null, fileName)
    }
  }),
  limits: {
    fileSize: uploadConfig.MAX_FILE_SIZE,
  },
  fileFilter(req, file, callback) {
    if (uploadConfig.ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(new Error("Invalid file type"))
    }
  }
})