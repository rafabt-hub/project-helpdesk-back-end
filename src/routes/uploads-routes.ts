import { Router } from "express"
import { UploadsController } from "@/controllers/uploads-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { multerUpload } from "@/providers/disk-storage"

const uploadsRoutes = Router()
const uploadsController = new UploadsController()

uploadsRoutes.patch(
  "/profile-image",
  ensureAuthenticated,
  multerUpload.single("profileImage"),
  uploadsController.uploadProfileImage
)

export { uploadsRoutes }