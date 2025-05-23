import express from "express";
import multer from "multer";
import { getUser } from "../controller/CountLike";
import { getUserById, updateUserProfile } from "../controller/AuthUser";
import { post, deleteUserPost } from "../controller/AuthPost";
import { countLikePost, countLikeComment, countLikeReply, checkLike, deleteLike } from "../controller/CountLike";
import { getCommentsByPostManual, addComment, addReplyToComment, getRepliesByComment } from "../controller/CommentController";
import { authorizationMiddleware } from "../middlewares/AuthorizationMiddleware";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Semua route di sini membutuhkan authorization
router.use(authorizationMiddleware);

router.get("/user", getUser);
router.get("/user/profile/:id", getUserById);
router.post('/user/post', post);
router.delete('/user/post/:postId', deleteUserPost);

// Like
router.get("/user/like", checkLike);
router.get("/user/like/check", checkLike);
router.delete("/user/like", deleteLike);
router.post("/user/post/:postId/like", countLikePost);
router.post("/user/post/:postId/comment/:commentId/like", countLikeComment);
router.post("/user/post/:postId/comment/:commentId/reply/:replyId/like", countLikeReply);

// Komentar
// router.get("/user/post/:postId/comment", getCommentsByPostManual);
router.post("/user/post/:postId/comment", addComment);
// router.get("/user/post/:postId/comment/:commentId/reply", getRepliesByComment);
router.post("/user/post/:postId/comment/:commentId/reply", addReplyToComment);

// Profile update
router.put('/user/:id', upload.single('profileImage'), updateUserProfile);

export default router;
