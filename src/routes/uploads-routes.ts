import { Router } from "express"
import multer from "multer"
import uploadConfig from "@/configs/uploads"

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { UploadsController } from "@/controllers/uploads-controller" // ← nomeado!

const uploadsRoutes = Router()
const uploadsController = new UploadsController()

const upload = multer(uploadConfig.MULTER)

uploadsRoutes.patch(
  "/",
  ensureAuthenticated,
  upload.single("profileImage"),
  uploadsController.update
)

export { uploadsRoutes }