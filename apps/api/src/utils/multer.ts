import multer, { FileFilterCallback, StorageEngine } from "multer";
import path from "path";
import { Request } from "express";

const storage: StorageEngine = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    // cb(null, path.join(__dirname, "../../uploads/avatars/"));
    cb(null, "public/images")
  },

  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const uniqueSuffix = Date.now();


    const ext = path.extname(file.originalname);

    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  // accept only images
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed!"));
  } else {
    cb(null, true);
  }
}

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

export const upload = multer({ storage });