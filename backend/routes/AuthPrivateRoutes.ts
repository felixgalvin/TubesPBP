import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getUserData, getUserById, updateUserProfile } from "../controller/UserController";
import { post, deleteUserPost, editPost, getUserCommentsAndReplies } from "../controller/PostController";
import { countLikePost, countLikeComment, countLikeReply, checkLike, deleteLike } from "../controller/CountLike";
import { getCommentsByPostManual, addComment, addReplyToComment, getRepliesByComment, deleteComment, deleteReply, editComment, editReply } from "../controller/CommentController";
import { authorizationMiddleware } from "../middlewares/AuthorizationMiddleware";
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

// Semua route di sini membutuhkan authorization
router.use(authorizationMiddleware);

router.get("/user", controllerWrapper(getUserData));
router.get("/user/profile/:id", controllerWrapper(getUserById));
router.get("/user/activity", controllerWrapper(getUserCommentsAndReplies));
router.post('/user/post', controllerWrapper(post));
router.put('/user/post/:postId', controllerWrapper(editPost));
router.delete('/user/post/:postId', controllerWrapper(deleteUserPost));

// Like
router.get("/user/like", controllerWrapper(checkLike));
router.get("/user/like/check", controllerWrapper(checkLike));
router.delete("/user/like", controllerWrapper(deleteLike));
router.post("/user/post/:postId/like", controllerWrapper(countLikePost));
router.post("/user/post/:postId/comment/:commentId/like", controllerWrapper(countLikeComment));
router.post("/user/post/:postId/comment/:commentId/reply/:replyId/like", controllerWrapper(countLikeReply));

// Komentar
router.post("/user/post/:postId/comment", controllerWrapper(addComment));
router.put("/user/post/:postId/comment/:commentId", controllerWrapper(editComment));
router.post("/user/post/:postId/comment/:commentId/reply", controllerWrapper(addReplyToComment));
router.put("/user/post/:postId/comment/:commentId/reply/:replyId", controllerWrapper(editReply));
router.delete("/user/post/:postId/comment/:commentId", controllerWrapper(deleteComment));
router.delete("/user/post/:postId/comment/:commentId/reply/:replyId", controllerWrapper(deleteReply));

// Profile update
router.put('/user/:id', upload.single('profileImage'), controllerWrapper(updateUserProfile));

export default router;
