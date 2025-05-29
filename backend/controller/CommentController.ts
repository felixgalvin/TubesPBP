import { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { User } from "../models/User";
import { Reply } from "../models/Reply";
import { Like } from "../models/Like";
import { AuthRequest } from "../middlewares/AuthorizationMiddleware";

export const getPostDetails = async (req: AuthRequest) => {
  const postId = req.params.postId;
  
  const post = await Post.findOne({ where: { post_Id: postId } });
  if (!post) {
    throw new Error("Post not found");
  }

  // Find the user who created the post
  const user = await User.findOne({ where: { user_Id: post.user_Id } });

  // Prepare result with user information
  const result = {
    ...post.toJSON(),
    username: user?.username || "Unknown User",
    profileImage: user?.profileImage || null,
  };

  return result;
};

export const getCommentsByPostManual = async (req: AuthRequest) => {
  const { postId } = req.params;

  const limit = parseInt((req.query.limit as string) || '10', 10);
  const offset = parseInt((req.query.offset as string) || '0', 10);
  
  const { count, rows } = await Comment.findAndCountAll({
    where: { post_Id: postId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
  const comments = rows;

  // Get unique user IDs from comments
  const userIds = [...new Set(comments.map(comment => comment.user_Id))];

  // Fetch user data based on user IDs
  const users = await User.findAll({
    where: { user_Id: userIds },
  });

  // Create user map for efficient lookup
  const userMap = new Map(
    users.map(user => [
      user.user_Id,
      {
        username: user.username,
        profileImage: user.profileImage || null,
      },
    ])
  );

  // Merge username and profileImage with each comment
  const result = comments.map(comment => {
    const userData = userMap.get(comment.user_Id);
    return {
      ...comment.toJSON(),
      username: userData?.username || 'Unknown User',
      profileImage: userData?.profileImage || null,
    };
  });

  return { data: result, total: count };
};

export const addComment = async (req: AuthRequest) => {
  const userId = req.userId;
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { comment } = req.body;
  
  if (!comment || !comment.trim()) {
    throw new Error("Comment cannot be empty");
  }

  const postId = req.params.postId;

  const newComment = await Comment.create({
    comment_Id: v4(),
    user_Id: userId,
    post_Id: postId,
    comment,
    likeComment: 0,
  });

  return newComment;
};

export const getRepliesByComment = async (req: AuthRequest) => {
  const { postId, commentId } = req.params;
  
  const limit = parseInt((req.query.limit as string) || '10', 10);
  const offset = parseInt((req.query.offset as string) || '0', 10);
  
  const { count, rows } = await Reply.findAndCountAll({
    where: { post_Id: postId, comment_Id: commentId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
  const replies = rows;

  // Get unique user IDs from replies
  const userIds = [...new Set(replies.map(r => r.user_Id))];
  
  // Fetch user data
  const users = await User.findAll({ 
    where: { user_Id: userIds } 
  });
  
  // Create user map for efficient lookup
  const userMap = new Map(
    users.map(u => [
      u.user_Id, 
      { username: u.username, profileImage: u.profileImage || null }
    ])
  );
  
  // Merge reply data with user information
  const result = replies.map(r => {
    const userData = userMap.get(r.user_Id);
    return {
      ...r.toJSON(),
      username: userData?.username || 'Unknown User',
      profileImage: userData?.profileImage || null,
    };
  });

  return { data: result, total: count };
};

export const addReplyToComment = async (req: AuthRequest) => {
  const { postId, commentId } = req.params;
  const userId = req.userId;
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { commentReply } = req.body;
  
  if (!commentReply || !commentReply.trim()) {
    throw new Error("Reply cannot be empty");
  }

  const post = await Post.findByPk(postId);
  const comment = await Comment.findByPk(commentId);
  
  if (!post || !comment) {
    throw new Error("Post or comment not found");
  }

  const newReply = await Reply.create({
    reply_Id: v4(),
    user_Id: userId,
    post_Id: postId,
    comment_Id: commentId,
    commentReply,
    likeReply: 0,
  });

  return newReply;
};

export const deleteComment = async (req: AuthRequest) => {
  const { commentId } = req.params;
  const userId = req.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const comment = await Comment.findOne({ 
    where: { comment_Id: commentId } 
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.user_Id !== userId) {
    throw new Error("You can only delete your own comments");
  }

  await Reply.destroy({ 
    where: { comment_Id: commentId } 
  });

  await Like.destroy({ 
    where: { comment_Id: commentId } 
  });

  await comment.destroy();

  return { message: "Comment deleted successfully" };
};

export const deleteReply = async (req: AuthRequest) => {
  const { replyId } = req.params;
  const userId = req.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const reply = await Reply.findOne({ 
    where: { reply_Id: replyId } 
  });

  if (!reply) {
    throw new Error("Reply not found");
  }

  if (reply.user_Id !== userId) {
    throw new Error("You can only delete your own replies");
  }

  await Like.destroy({ 
    where: { reply_Id: replyId } 
  });

  await reply.destroy();

  return { message: "Reply deleted successfully" };
};

export const editComment = async (req: AuthRequest) => {
  const { commentId } = req.params;
  const userId = req.userId;
  const { comment } = req.body;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!comment || !comment.trim()) {
    throw new Error("Comment cannot be empty");
  }

  const existingComment = await Comment.findOne({ 
    where: { comment_Id: commentId } 
  });

  if (!existingComment) {
    throw new Error("Comment not found");
  }

  if (existingComment.user_Id !== userId) {
    throw new Error("You can only edit your own comments");
  }

  await existingComment.update({ comment: comment.trim() });

  return { 
    message: "Comment updated successfully",
    comment: existingComment 
  };
};

export const editReply = async (req: AuthRequest) => {
  const { replyId } = req.params;
  const userId = req.userId;
  const { commentReply } = req.body;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!commentReply || !commentReply.trim()) {
    throw new Error("Reply cannot be empty");
  }

  const existingReply = await Reply.findOne({ 
    where: { reply_Id: replyId } 
  });

  if (!existingReply) {
    throw new Error("Reply not found");
  }

  if (existingReply.user_Id !== userId) {
    throw new Error("You can only edit your own replies");
  }

  await existingReply.update({ commentReply: commentReply.trim() });

  return { 
    message: "Reply updated successfully",
    reply: existingReply 
  };
};