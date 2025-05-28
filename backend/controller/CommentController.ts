
import { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { User } from "../models/User";
import { Reply } from "../models/Reply";
import { AuthRequest } from "../middlewares/AuthorizationMiddleware";

export const getPostDetails = async (req: AuthRequest) => {
  const postId = req.params.postId;
  
  // Find the post
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

// Get comments by post with pagination and user information
export const getCommentsByPostManual = async (req: AuthRequest) => {
  const { postId } = req.params;

  // Get comments with pagination support via ?limit=&offset=
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
  
  // Check authorization
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { comment } = req.body;
  
  // Validate comment content
  if (!comment || !comment.trim()) {
    throw new Error("Comment cannot be empty");
  }

  const postId = req.params.postId;

  // Create new comment
  const newComment = await Comment.create({
    comment_Id: v4(),
    user_Id: userId,
    post_Id: postId,
    comment,
    likeComment: 0,
  });

  return newComment;
};

// Get all replies for a specific comment
export const getRepliesByComment = async (req: AuthRequest) => {
  const { postId, commentId } = req.params;
  
  // Parse pagination parameters
  const limit = parseInt((req.query.limit as string) || '10', 10);
  const offset = parseInt((req.query.offset as string) || '0', 10);
  
  // Find replies with pagination
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

// Add reply to a specific comment
export const addReplyToComment = async (req: AuthRequest) => {
  const { postId, commentId } = req.params;
  const userId = req.userId;
  
  // Check authorization
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { commentReply } = req.body;
  
  // Validate reply content
  if (!commentReply || !commentReply.trim()) {
    throw new Error("Reply cannot be empty");
  }

  // Verify post and comment exist
  const post = await Post.findByPk(postId);
  const comment = await Comment.findByPk(commentId);
  
  if (!post || !comment) {
    throw new Error("Post or comment not found");
  }

  // Create new reply
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