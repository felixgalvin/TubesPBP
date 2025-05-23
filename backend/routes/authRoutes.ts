// // routes/authRoutes.ts
// import express from "express";
// import multer from "multer";
// import { signup } from "../controller/AuthRegister";
// import { login } from "../controller/AuthLogin";
// import { getUserData, getUserById } from "../controller/AuthUser";
// import { post, getAllPost, getUserPosts, deleteUserPost, getPostsByTopic, getUnlikedPosts, getPopularPosts } from "../controller/AuthPost";
// import { countLikePost, countLikeComment, countLikeReply } from "../controller/CountLike";
// import { checkLike } from "../controller/CountLike";
// import { deleteLike } from "../controller/CountLike";
// import {getPostDetails, getCommentsByPostManual, addComment, addReplyToComment, getRepliesByComment} from "../controller/CommentController";

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage });

// router.post("/register", upload.single("profileImage"), signup);
// router.post("/login", login);
// router.get("/user", getUserData);
// router.get("/user/profile/:userid", getUserById); // Get specific user profile by ID (for ProfilePage)

// // User post routes
// router.post('/user/post', post);
// router.get('/user/post', getAllPost);
// router.get('/user/post/:postId', getPostDetails); // Detail post

// //Like
// router.get("/user/like", checkLike);
// router.delete("/user/like", deleteLike);
// router.post("/user/post/:postId/like", countLikePost);
// router.post("/user/post/:postId/comment/:commentId/like", countLikeComment);
// router.post("/user/post/:postId/comment/:commentId/reply/:replyId/like", countLikeReply);

// router.get("/user/post/:postId/comment", getCommentsByPostManual); // Ambil komentar
// router.post("/user/post/:postId/comment", addComment); // Tambah komentar

// router.post("/user/post/:postId/comment/:commentId/reply", addReplyToComment);
// router.get("/user/post/:postId/comment/:commentId/reply", getRepliesByComment);
// router.get('/user/:userid/posts', getUserPosts); // Fetch posts by a specific user
// router.delete('/user/post/:postId', deleteUserPost);
// router.get('/user/post/topic', getPostsByTopic); // Filter by topic
// router.get('/user/post/unliked', getUnlikedPosts); // Post tanpa like
// router.get('/user/post/popular', getPopularPosts); // Popular posts

// export default router;
