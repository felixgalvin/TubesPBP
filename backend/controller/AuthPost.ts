
import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
import { User } from "../models/User";
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
    title,
    post: content,
    likePost: 0,
    topik,
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

  // Find posts by topic with pagination
  const { count, rows } = await Post.findAndCountAll({
    where: { topik },
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  if (!rows || rows.length === 0) {
    throw new Error("No posts found");
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

  // Find posts ordered by likes and creation date
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