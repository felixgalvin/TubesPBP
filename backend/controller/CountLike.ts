import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import { User } from "../models/User";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { Reply } from "../models/Reply";
import { Like } from "../models/Like";
import { v4 as uuidv4 } from "uuid";
import { AuthRequest } from "../middlewares/AuthorizationMiddleware";

export const countLikePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const postId = req.params.postId;
  const userId = req.userId;
  try {
    if (!userId) throw new Error("Unauthorized");
    const post = await Post.findOne({ where: { post_Id: postId } });
    if (!post) throw new Error("Post not found");
    const existingLike = await Like.findOne({ where: { user_Id: userId, post_Id: postId } });
    if (existingLike) {
      await existingLike.destroy();
      post.likePost = Math.max(0, post.likePost - 1);
      await post.save();
      res.status(200).json({ message: "Unliked", likePost: post.likePost });
    } else {
      await Like.create({ like_Id: uuidv4(), user_Id: userId, post_Id: postId });
      post.likePost += 1;
      await post.save();
      res.status(200).json({ message: "Liked", likePost: post.likePost });
    }
  } catch (error) {
    next(error);
  }
};

export const countLikeComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const commentId = req.params.commentId;
  const userId = req.userId;
  try {
    if (!userId) throw new Error("Unauthorized");
    const comment = await Comment.findOne({ where: { comment_Id: commentId } });
    if (!comment) throw new Error("Comment not found");
    const existingLike = await Like.findOne({ where: { user_Id: userId, comment_Id: commentId } });
    if (existingLike) {
      await existingLike.destroy();
      comment.likeComment = Math.max(0, (comment.likeComment || 0) - 1);
      await comment.save();
      res.status(200).json({ message: "Unliked", likeComment: comment.likeComment });
    } else {
      await Like.create({like_Id: uuidv4(), user_Id: userId, comment_Id: commentId,});
      comment.likeComment = (comment.likeComment || 0) + 1;
      await comment.save();
      res.status(200).json({ message: "Liked", likeComment: comment.likeComment });
    }
  } catch (error) {
    next(error);
  }
};

export const countLikeReply = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const replyId = req.params.replyId;
  const userId = req.userId;
  try {
    if (!userId) throw new Error("Unauthorized");
    const reply = await Reply.findOne({ where: { reply_Id: replyId } });
    if (!reply) throw new Error("Reply not found");
    const existingLike = await Like.findOne({ where: { user_Id: userId, reply_Id: replyId } });
    if (existingLike) {
      await existingLike.destroy();
      reply.likeReply = Math.max(0, (reply.likeReply || 0) - 1);
      await reply.save();
      res.status(200).json({ message: "Unliked", likeReply: reply.likeReply });
    } else {
      await Like.create({like_Id: uuidv4(), user_Id: userId, reply_Id: replyId,});
      reply.likeReply = (reply.likeReply || 0) + 1;
      await reply.save();
      res.status(200).json({ message: "Liked", likeReply: reply.likeReply });
    }
  } catch (error) {
    next(error);
  }
};

export const checkLike = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.userId;
  try {
    if (!userId) throw new Error("Unauthorized");
    const { postId, commentId, replyId } = req.query;
    if (!postId && !commentId && !replyId) throw new Error("No id provided");
    const orConditions = [];
    if (postId) orConditions.push({ post_Id: postId });
    if (commentId) orConditions.push({ comment_Id: commentId });
    if (replyId) orConditions.push({ reply_Id: replyId });
    const like = await Like.findOne({
      where: {
        user_Id: userId,
        [Op.or]: orConditions,
      },
    });
    res.json({ liked: !!like });
  } catch (err) {
    next(err);
  }
};

export const deleteLike = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.userId;
  try {
    if (!userId) throw new Error("Unauthorized");
    const { postId, commentId, replyId } = req.query;
    if (!postId && !commentId && !replyId) throw new Error("No id provided");
    const conditions = [
      postId ? { post_Id: postId } : null,
      commentId ? { comment_Id: commentId } : null,
      replyId ? { reply_Id: replyId } : null,
    ].filter(Boolean) as any[];
    const like = await Like.findOne({
      where: {
        user_Id: userId,
        [Op.or]: conditions,
      },
    });
    if (!like) throw new Error("Like not found");
    await like.destroy();
    res.json({ message: "Like deleted" });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.userId;
  try {
    if (!userId) throw new Error("Unauthorized");
    const user = await User.findByPk(userId);
    const likes = await Like.findAll({ where: { user_Id: userId } });
    const likedPosts = likes.filter(like => like.post_Id).map(like => like.post_Id);
    const likedComments = likes.filter(like => like.comment_Id).map(like => like.comment_Id);
    const likedReplies = likes.filter(like => like.reply_Id).map(like => like.reply_Id);
    res.status(200).json({
      message: "User data fetched",
      data: {
        ...user?.toJSON(),
        likedPosts,
        likedComments,
        likedReplies,
      },
    });
  } catch (err) {
    next(err);
  }
};
