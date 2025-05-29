import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { signup } from "../controller/RegisterController";
import { login } from "../controller/LoginController";
import { getAllPost, getUserPosts, getPostsByTopic, getPopularPosts } from "../controller/PostController";
import { getPostDetails, getCommentsByPostManual, getRepliesByComment } from "../controller/CommentController";
import { controllerWrapper } from "../utils/ControllerWrapper";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, "../../user_uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Public routes (no auth required)
router.post("/register", upload.single("profileImage"), controllerWrapper(signup));
router.post("/login", controllerWrapper(login));
router.get("/user/post", controllerWrapper(getAllPost)); // Semua post (guest bisa lihat)
router.get("/user/post/popular", controllerWrapper(getPopularPosts)); // Semua post popular (guest bisa lihat)
router.get("/user/post/topic", controllerWrapper(getPostsByTopic)); // Semua post by topic (guest bisa lihat)
// router.get("/user/post/unliked", controllerWrapper(getUnlikedPosts)); // Semua post tanpa like (guest bisa lihat)
router.get("/user/post/:postId", controllerWrapper(getPostDetails)); // Detail post (guest bisa lihat)
router.get('/user/:userid/posts', controllerWrapper(getUserPosts)); // Post by user (guest bisa lihat)
router.get("/user/post/:postId/comment", controllerWrapper(getCommentsByPostManual));
router.get("/user/post/:postId/comment/:commentId/reply", controllerWrapper(getRepliesByComment));

export default router;
