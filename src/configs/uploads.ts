import path from "node:path"

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp")
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads")

export default {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MAX_FILE_SIZE: 1024 * 1024 * 3, // 3MB
  ACCEPTED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png"],
}