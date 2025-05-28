import express from "express";
import multer from "multer";
import { getUserData, getUserById, updateUserProfile } from "../controller/AuthUser";
import { post, deleteUserPost } from "../controller/AuthPost";
import { countLikePost, countLikeComment, countLikeReply, checkLike, deleteLike } from "../controller/CountLike";
import { getCommentsByPostManual, addComment, addReplyToComment, getRepliesByComment } from "../controller/CommentController";
import { authorizationMiddleware } from "../middlewares/AuthorizationMiddleware";
import { controllerWrapper } from "../utils/ControllerWrapper";

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

router.get("/user", controllerWrapper(getUserData));
router.get("/user/profile/:id", controllerWrapper(getUserById));
router.post('/user/post', controllerWrapper(post));
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
router.post("/user/post/:postId/comment/:commentId/reply", controllerWrapper(addReplyToComment));

// Profile update
router.put('/user/:id', upload.single('profileImage'), controllerWrapper(updateUserProfile));

export default router;
