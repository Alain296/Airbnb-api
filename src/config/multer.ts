import multer from "multer";
import { Request } from "express";

// Use memory storage - files stay as Buffers in RAM
// No disk writes needed before uploading to Cloudinary
const storage = multer.memoryStorage();

// File filter - accept only images
const fileFilter = (
  req: Request,
  file: any, // Using any for multer file type compatibility
  cb: multer.FileFilterCallback
) => {
  // Accept only jpeg, png, and webp
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});
