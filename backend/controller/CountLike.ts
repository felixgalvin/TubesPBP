
import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import { User } from "../models/User";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { Reply } from "../models/Reply";
import { Like } from "../models/Like";
import { v4 as uuidv4 } from "uuid";
import { AuthRequest } from "../middlewares/AuthorizationMiddleware";

export const countLikePost = async (req: AuthRequest) => {
  const postId = req.params.postId;
  const userId = req.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const post = await Post.findOne({ where: { post_Id: postId } });
  if (!post) {
    throw new Error("Post not found");
  }

  const existingLike = await Like.findOne({ 
    where: { user_Id: userId, post_Id: postId } 
  });

  if (existingLike) {
    await existingLike.destroy();
    post.likePost = Math.max(0, post.likePost - 1);
    await post.save();
    
    return { message: "Unliked", likePost: post.likePost };
  } else {
    await Like.create({ 
      like_Id: uuidv4(), 
      user_Id: userId, 
      post_Id: postId 
    });
    post.likePost += 1;
    await post.save();
    
    return { message: "Liked", likePost: post.likePost };
  }
};

export const countLikeComment = async (req: AuthRequest) => {
  const commentId = req.params.commentId;
  const userId = req.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const comment = await Comment.findOne({ where: { comment_Id: commentId } });
  if (!comment) {
    throw new Error("Comment not found");
  }

  const existingLike = await Like.findOne({ 
    where: { user_Id: userId, comment_Id: commentId } 
  });

  if (existingLike) {
    await existingLike.destroy();
    comment.likeComment = Math.max(0, (comment.likeComment || 0) - 1);
    await comment.save();
    
    return { message: "Unliked", likeComment: comment.likeComment };

  } else {
    await Like.create({ 
      like_Id: uuidv4(), 
      user_Id: userId, 
      comment_Id: commentId 
    });
    comment.likeComment = (comment.likeComment || 0) + 1;
    await comment.save();
    
    return { message: "Liked", likeComment: comment.likeComment };
  }
};

export const countLikeReply = async (req: AuthRequest) => {
  const replyId = req.params.replyId;
  const userId = req.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const reply = await Reply.findOne({ where: { reply_Id: replyId } });
  if (!reply) {
    throw new Error("Reply not found");
  }

  const existingLike = await Like.findOne({ 
    where: { user_Id: userId, reply_Id: replyId } 
  });

  if (existingLike) {
    await existingLike.destroy();
    reply.likeReply = Math.max(0, (reply.likeReply || 0) - 1);
    await reply.save();
    
    return { message: "Unliked", likeReply: reply.likeReply };
    
  } else {
    await Like.create({ 
      like_Id: uuidv4(), 
      user_Id: userId, 
      reply_Id: replyId 
    });
    reply.likeReply = (reply.likeReply || 0) + 1;
    await reply.save();
    
    return { message: "Liked", likeReply: reply.likeReply };
  }
};

export const checkLike = async (req: AuthRequest) => {
  const userId = req.userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { postId, commentId, replyId } = req.query;
  
  if (!postId && !commentId && !replyId) {
    throw new Error("No id provided");
  }

  // Build OR conditions for the query
  const orConditions = [];
  if (postId) {
    orConditions.push({ post_Id: postId });
  }
  if (commentId) {
    orConditions.push({ comment_Id: commentId });
  }
  if (replyId) {
    orConditions.push({ reply_Id: replyId });
  }

  // Check if like exists
  const like = await Like.findOne({ 
    where: { 
      user_Id: userId, 
      [Op.or]: orConditions 
    } 
  });

  return { liked: !!like };
};

export const deleteLike = async (req: AuthRequest) => {
  const userId = req.userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { postId, commentId, replyId } = req.query;
  
  if (!postId && !commentId && !replyId) {
    throw new Error("No id provided");
  }

  // Build conditions for the query
  const conditions = [
    postId ? { post_Id: postId } : null,
    commentId ? { comment_Id: commentId } : null,
    replyId ? { reply_Id: replyId } : null,
  ].filter(Boolean) as any[];

  // Find the like to delete
  const like = await Like.findOne({ 
    where: { 
      user_Id: userId, 
      [Op.or]: conditions 
    } 
  });

  if (!like) {
    throw new Error("Like not found");
  }

  // Delete the like
  await like.destroy();
  
  return { message: "Like deleted" };
};
