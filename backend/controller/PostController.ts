import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { Comment } from "../models/Comment";
import { Reply } from "../models/Reply";
import { v4 } from "uuid";
import { AuthRequest } from "../middlewares/AuthorizationMiddleware";

export const post = async (req: AuthRequest) => {
  const userId = req.userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { title, post: content, topik } = req.body;

  if (!title) {
    throw new Error("Title is required");
  }
  if (!content) {
    throw new Error("Post content is required");
  }
  if (!topik) {
    throw new Error("Topik is required");
  }

  await Post.create({
    post_Id: v4(),
    user_Id: userId,
    title: title.trim(),
    post: content,
    likePost: 0,
    topik: topik.trim(),
  });

  return { message: "Post created successfully" };
};

export const getAllPost = async (req: Request) => {
  const limit = parseInt((req.query.limit as string) || "10", 10);
  const offset = parseInt((req.query.offset as string) || "0", 10);

  const { count, rows } = await Post.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  if (!rows || rows.length === 0) {
    return { data: [], total: count || 0 };
  }

  // Get unique user IDs
  const userIds = [...new Set(rows.map((p: any) => p.user_Id))];

  // Fetch user data
  const users = await User.findAll({
    where: { user_Id: userIds },
    attributes: ["user_Id", "username", "profileImage"],
  });

  // Create user map for efficient lookup
  const userMap = new Map(
    users.map((u: any) => [
      u.user_Id, 
      { username: u.username, profileImage: u.profileImage }
    ])
  );

  // Merge post data with user information
  const result = rows.map((post: any) => {
    const user = userMap.get(post.user_Id) || { 
      username: "Unknown User", 
      profileImage: null 
    };

    return { 
      ...post.toJSON(), 
      username: user.username, 
      profileImage: user.profileImage || null 
    };
  });

  return { data: result, total: count };
};

export const getUserPosts = async (req: Request) => {
  const userId = req.params.userid;
  
  const posts = await Post.findAll({ 
    where: { user_Id: userId } 
  });
  
  return posts;
};

export const deleteUserPost = async (req: AuthRequest) => {
  const authUserId = req.userId;
  if (!authUserId) {
    throw new Error("Unauthorized");
  }

  const postId = req.params.postId;
  
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  if (post.user_Id !== authUserId) {
    throw new Error("Forbidden");
  }

  await post.destroy();
  
  return { message: "Post deleted" };
};

export const getPostsByTopic = async (req: Request) => {
  const limit = parseInt((req.query.limit as string) || "10", 10);
  const offset = parseInt((req.query.offset as string) || "0", 10);
  const topik = req.query.topik as string;

  if (!topik) {
    throw new Error("Topik is required");
  }

  const { count, rows } = await Post.findAndCountAll({
    where: { topik },
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  if (!rows || rows.length === 0) {
    return { data: [], total: count || 0 };
  }

  // Get unique user IDs
  const userIds = [...new Set(rows.map((p: any) => p.user_Id))];

  // Fetch user data
  const users = await User.findAll({
    where: { user_Id: userIds },
    attributes: ["user_Id", "username", "profileImage"],
  });

  // Create user map for efficient lookup
  const userMap = new Map(
    users.map((u: any) => [
      u.user_Id, 
      { username: u.username, profileImage: u.profileImage }
    ])
  );

  // Merge post data with user information
  const result = rows.map((post: any) => {
    const user = userMap.get(post.user_Id) || { 
      username: "Unknown User", 
      profileImage: null 
    };
    
    return { 
      ...post.toJSON(), 
      username: user.username, 
      profileImage: user.profileImage || null 
    };
  });

  return { data: result, total: count };
};

export const getPopularPosts = async (req: Request) => {
  const limit = parseInt((req.query.limit as string) || "10", 10);
  const offset = parseInt((req.query.offset as string) || "0", 10);

  const { count, rows } = await Post.findAndCountAll({
    limit,
    offset,
    order: [
      ["likePost", "DESC"],
      ["createdAt", "DESC"],
    ],
  });

  if (!rows || rows.length === 0) {
    return { data: [], total: count || 0 };
  }

  // Get unique user IDs
  const userIds = [...new Set(rows.map((p: any) => p.user_Id))];

  const users = await User.findAll({
    where: { user_Id: userIds },
    attributes: ["user_Id", "username", "profileImage"],
  });

  // Create user map for efficient lookup
  const userMap = new Map(
    users.map((u: any) => [
      u.user_Id, 
      { username: u.username, profileImage: u.profileImage }
    ])
  );

  // Merge post data with user information
  const result = rows.map((post: any) => {
    const user = userMap.get(post.user_Id) || { 
      username: "Unknown User", 
      profileImage: null 
    };
    
    return { 
      ...post.toJSON(), 
      username: user.username, 
      profileImage: user.profileImage || null 
    };
  });

  return { data: result, total: count };
};

export const editPost = async (req: AuthRequest) => {
  const authUserId = req.userId;
  if (!authUserId) {
    throw new Error("Unauthorized");
  }

  const postId = req.params.postId;
  const { title, post: content, topik } = req.body;

  if (!title) {
    throw new Error("Title is required");
  }
  if (!content) {
    throw new Error("Post content is required");
  }
  if (!topik) {
    throw new Error("Topic is required");
  }

  const post = await Post.findByPk(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  if (post.user_Id !== authUserId) {
    throw new Error("Forbidden: You can only edit your own posts");
  }

  await post.update({
    title: title.trim(),
    post: content, 
    topik: topik.trim()
  });

  return { 
    message: "Post updated successfully",
    data: post
  };
};

export const getUserCommentsAndReplies = async (req: AuthRequest) => {
  const authUserId = req.userId;
  if (!authUserId) {
    throw new Error("Unauthorized");
  }

  const userComments = await Comment.findAll({
    where: { user_Id: authUserId },
    order: [['createdAt', 'DESC']]
  });

  const userReplies = await Reply.findAll({
    where: { user_Id: authUserId },
    order: [['createdAt', 'DESC']]
  });

  // Process comments - get post and author info for each comment
  const commentsData = await Promise.all(
    userComments.map(async (comment: any) => {
      const post = await Post.findByPk(comment.post_Id);
      const postAuthor = post ? await User.findByPk(post.user_Id) : null;
      
      return {
        type: 'comment',
        id: comment.comment_Id,
        content: comment.comment,
        createdAt: comment.createdAt,
        post: post ? {
          post_Id: post.post_Id,
          title: post.title,
          content: post.post,
          topik: post.topik,
          createdAt: post.createdAt,
          author: postAuthor ? {
            username: postAuthor.username,
            profileImage: postAuthor.profileImage
          } : {
            username: 'Unknown User',
            profileImage: null
          }
        } : null
      };
    })
  );

  // Process replies - get comment, post, and author info for each reply
  const repliesData = await Promise.all(
    userReplies.map(async (reply: any) => {
      const comment = await Comment.findByPk(reply.comment_Id);
      const post = comment ? await Post.findByPk(comment.post_Id) : null;
      const postAuthor = post ? await User.findByPk(post.user_Id) : null;
      
      return {
        type: 'reply',
        id: reply.reply_Id,
        content: reply.commentReply,
        createdAt: reply.createdAt,
        post: post ? {
          post_Id: post.post_Id,
          title: post.title,
          content: post.post,
          topik: post.topik,
          createdAt: post.createdAt,
          author: postAuthor ? {
            username: postAuthor.username,
            profileImage: postAuthor.profileImage
          } : {
            username: 'Unknown User',
            profileImage: null
          }
        } : null
      };
    })
  );

  // Filter out items with null posts and combine
  const validComments = commentsData.filter(item => item.post !== null);
  const validReplies = repliesData.filter(item => item.post !== null);
  
  // Combine and sort by date
  const allActivity = [...validComments, ...validReplies]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    comments: validComments,
    replies: validReplies,
    allActivity: allActivity
  };
};