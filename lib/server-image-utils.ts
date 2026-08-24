import { promises as fs } from "fs";
import path from "path";

const IMAGE_DIR = "public/images";

function getImageFolderPath(folder: string = "categories") {
  return path.join(process.cwd(), IMAGE_DIR, folder);
}

export function isBase64Image(value?: string) {
  return typeof value === "string" && value.startsWith("data:image/");
}

export async function saveBase64Image(
  value: string, 
  prefix: string = "category", 
  folder: string = "categories"
) {
  const match = value.match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/);

  if (!match) {
    throw new Error("Invalid image data");
  }

  const mimeType = match[1];
  const base64Data = match[2];
  const ext = mimeType === "jpeg" ? "jpg" : mimeType;
  const filename = `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
  const folderPath = getImageFolderPath(folder);

  await fs.mkdir(folderPath, { recursive: true });
  await fs.writeFile(path.join(folderPath, filename), Buffer.from(base64Data, "base64"));

  // FIX: Remove "/public/" from the path
  // Return just /images/folder/filename
  return `/${IMAGE_DIR.replace(/^public\//, "")}/${folder}/${filename}`;
}