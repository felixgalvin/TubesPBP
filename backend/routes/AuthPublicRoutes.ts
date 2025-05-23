import express from "express";
import multer from "multer";
import { signup } from "../controller/AuthRegister";
import { login } from "../controller/AuthLogin";
import { getAllPost, getUserPosts, getPostsByTopic, getPopularPosts } from "../controller/AuthPost";
import { getPostDetails, getCommentsByPostManual, getRepliesByComment } from "../controller/CommentController";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Public routes (no auth required)
router.post("/register", upload.single("profileImage"), signup);
router.post("/login", login);
router.get("/user/post", getAllPost); // Semua post (guest bisa lihat)
router.get("/user/post/popular", getPopularPosts); // Semua post popular (guest bisa lihat)
router.get("/user/post/topic", getPostsByTopic); // Semua post by topic (guest bisa lihat)
// router.get("/user/post/unliked", getUnlikedPosts); // Semua post tanpa like (guest bisa lihat)
router.get("/user/post/:postId", getPostDetails); // Detail post (guest bisa lihat)
router.get('/user/:userid/posts', getUserPosts); // Post by user (guest bisa lihat)
router.get("/user/post/:postId/comment", getCommentsByPostManual);
router.get("/user/post/:postId/comment/:commentId/reply", getRepliesByComment);

export default router;
