import fs from "node:fs"
import path from "node:path"

export class DiskStorage {
  constructor() {
    const uploadsPath = path.resolve(__dirname, "..", "..", "tmp", "uploads");
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
  }

  async saveFile(file: string) {
    const tmpFolder = path.resolve(__dirname, "..", "..", "tmp");
    const uploadsFolder = path.resolve(tmpFolder, "uploads");

    await fs.promises.rename(
      path.resolve(tmpFolder, file),
      path.resolve(uploadsFolder, file)
    );

    return file;
  }

  async deleteFile(file: string, type: "tmp" | "upload") {
    const folder = type === "tmp" ? "tmp" : "tmp/uploads";
    const filePath = path.resolve(__dirname, "..", "..", folder, file);

    try {
      await fs.promises.stat(filePath);
      await fs.promises.unlink(filePath);
    } catch {
      // arquivo não existe, nada a fazer
    }
  }
}