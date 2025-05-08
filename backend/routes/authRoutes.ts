// routes/authRoutes.ts
import express from "express";
import multer from "multer";
import { signup } from "../controller/AuthRegister";
import { login } from "../controller/AuthLogin";
import { getUserData } from "../controller/AuthUser";
import { post, getAllPost } from "../controller/AuthPost";
import { countLike } from "../controller/CountLike";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/register", upload.single("profileImage"), signup);
router.post("/login", login);
router.get("/user", getUserData);

router.post("/user/post", post);
router.get("/user/post", getAllPost);
router.put("/user/post/:postId/like", countLike);

export default router;
