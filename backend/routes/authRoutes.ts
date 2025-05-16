// routes/authRoutes.ts
import express from "express";
import multer from "multer";
import { signup } from "../controller/AuthRegister";
import { login } from "../controller/AuthLogin";
import { getUserData } from "../controller/AuthUser";
import { post, getAllPost } from "../controller/AuthPost";
import { countLike } from "../controller/CountLike";
import {getPostDetails, getCommentsByPostManual, addComment, addReplyToComment, getRepliesByComment} from "../controller/CommentController";

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

router.get("/user/post/:postId", getPostDetails); // Detail post
router.get("/user/post/:postId/comment", getCommentsByPostManual); // Ambil komentar
router.post("/user/post/:postId/comment", addComment); // Tambah komentar
router.post("/user/post/:postId/comment/:commentId/reply", addReplyToComment);
router.get("/user/post/:postId/comment/:commentId/reply", getRepliesByComment);

export default router;
