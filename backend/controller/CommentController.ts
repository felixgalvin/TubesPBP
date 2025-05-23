import { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { User } from "../models/User";
import { Reply } from "../models/Reply";
import { AuthRequest } from "../middlewares/AuthorizationMiddleware";

// Backend: getPostDetails
export const getPostDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findOne({ where: { post_Id: postId } });
    if (!post) throw new Error("Post not found");
    const user = await User.findOne({ where: { user_Id: post.user_Id } });
    const result = {
      ...post.toJSON(),
      username: user?.username || "Unknown User",
      profileImage: user?.profileImage || null,
    };
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Backend: getCommentsByPostManual
export const getCommentsByPostManual = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;

    // Ambil komentar dengan pagination support via ?limit=&offset=
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const offset = parseInt((req.query.offset as string) || '0', 10);
    const { count, rows } = await Comment.findAndCountAll({
      where: { post_Id: postId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    const comments = rows;

    // Ambil semua user_Id unik dari komentar
    const userIds = [...new Set(comments.map(comment => comment.user_Id))];

    // Ambil data user berdasarkan user_Id
    const users = await User.findAll({
      where: { user_Id: userIds },
    });

    // Buat map userId => { username, profileImage }
    const userMap = new Map(
      users.map(user => [
        user.user_Id,
        {
          username: user.username,
          profileImage: user.profileImage || null, // tidak pakai defaultProfileImage
        },
      ])
    );

    // Gabungkan username dan profileImage ke tiap komentar
    const result = comments.map(comment => {
      const userData = userMap.get(comment.user_Id);
      return {
        ...comment.toJSON(),
        username: userData?.username || 'Unknown User',
        profileImage: userData?.profileImage || null, // tidak pakai defaultProfileImage
      };
    });

    res.status(200).json({ data: result, total: count });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.userId;
  try {
    if (!userId) throw new Error("Unauthorized");
    const { comment } = req.body;
    if (!comment || !comment.trim()) throw new Error("Comment cannot be empty");
    const postId = req.params.postId;
    const newComment = await Comment.create({
      comment_Id: v4(),
      user_Id: userId,
      post_Id: postId,
      comment,
      likeComment: 0,
    });
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

// Tambah reply ke comment tertentu
export const addReplyToComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { postId, commentId } = req.params;
  const userId = req.userId;
  try {
    if (!userId) throw new Error("Unauthorized");
    const { commentReply } = req.body;
    if (!commentReply || !commentReply.trim()) throw new Error("Reply cannot be empty");
    const post = await Post.findByPk(postId);
    const comment = await Comment.findByPk(commentId);
    if (!post || !comment) throw new Error("Post or comment not found");
    const newReply = await Reply.create({
      reply_Id: v4(),
      user_Id: userId,
      post_Id: postId,
      comment_Id: commentId,
      commentReply,
      likeReply: 0,
    });
    res.status(201).json(newReply);
  } catch (error) {
    next(error);
  }
};


// Ambil semua reply untuk comment tertentu
export const getRepliesByComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { postId, commentId } = req.params;
  try {
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const offset = parseInt((req.query.offset as string) || '0', 10);
    const { count, rows } = await Reply.findAndCountAll({
      where: { post_Id: postId, comment_Id: commentId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    const replies = rows;
    // Ambil semua user unik
    const userIds = [...new Set(replies.map(r => r.user_Id))];
    const users = await User.findAll({ where: { user_Id: userIds } });
    const userMap = new Map(users.map(u => [u.user_Id, { username: u.username, profileImage: u.profileImage || null }]));
    const result = replies.map(r => {
      const userData = userMap.get(r.user_Id);
      return {
        ...r.toJSON(),
        username: userData?.username || 'Unknown User',
        profileImage: userData?.profileImage || null,
      };
    });
    res.status(200).json({ data: result, total: count });
  } catch (error) {
    next(error);
  }
};

