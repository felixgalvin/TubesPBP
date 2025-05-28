import express from "express";
import multer from "multer";
import { signup } from "../controller/AuthRegister";
import { login } from "../controller/AuthLogin";
import { getAllPost, getUserPosts, getPostsByTopic, getPopularPosts } from "../controller/AuthPost";
import { getPostDetails, getCommentsByPostManual, getRepliesByComment } from "../controller/CommentController";
import { controllerWrapper } from "../utils/ControllerWrapper";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
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
