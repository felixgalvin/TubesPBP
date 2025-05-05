// routes/authRoutes.ts
import express from "express";
import multer from "multer";
import { signup } from "../controller/AuthRegister";
import { login } from "../controller/AuthLogin";
import { getUserData } from "../controller/AuthUser";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Register user (dengan gambar)
router.post("/register", upload.single("profileImage"), signup);

// Login user (tidak pakai gambar)
router.post("/login", login);
router.get("/user", getUserData);

export default router;
