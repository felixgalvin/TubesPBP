import express from "express";
import multer from "multer";
import { signup } from "../controller/authRegister";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/register", upload.single("profileImage"), signup);

export default router;
