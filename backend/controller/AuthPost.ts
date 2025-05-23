import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { v4 } from "uuid";
import { AuthRequest } from "../middlewares/AuthorizationMiddleware";

export const post = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.userId;
  try {
    if (!userId) throw new Error("Unauthorized");
    const { title, post, topik } = req.body;
    if (!title) throw new Error("Title is required");
    if (!post) throw new Error("Post content is required");
    if (!topik) throw new Error("Topik is required");
    await Post.create({
      post_Id: v4(),
      user_Id: userId,
      title,
      post,
      likePost: 0,
      topik,
    });
    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const offset = parseInt((req.query.offset as string) || '0', 10);
    const { count, rows } = await Post.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });

    if (!rows || rows.length === 0) {
      res.status(200).json({ data: [], total: count || 0 });
      return;
    }

    const userIds = [...new Set(rows.map((p: any) => p.user_Id))];

    const users = await User.findAll({
      where: { user_Id: userIds },
      attributes: ["user_Id", "username", "profileImage"],
    });

    if (!users || users.length === 0) {
      throw new Error("No users found");
    }

    const userMap = new Map(
      users.map((u: any) => [
        u.user_Id,
        { username: u.username, profileImage: u.profileImage },
      ])
    );

    if (!userMap) {
            console.log("No usersMap found");

    }

    const result = rows.map((post: any) => {
      const user = userMap.get(post.user_Id) || {
        username: "Unknown User",
        profileImage:  null,
      };

      return {
        ...post.toJSON(),
        username: user.username,
        profileImage: user.profileImage || null,
      };
    });

    res.status(200).json({ data: result, total: count });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.userid;
  try {
    const posts = await Post.findAll({ where: { user_Id: userId } });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const deleteUserPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authUserId = req.userId;
  try {
    if (!authUserId) throw new Error('Unauthorized');
    const postId = req.params.postId;
    const post = await Post.findByPk(postId);
    if (!post) throw new Error('Post not found');
    if (post.user_Id !== authUserId) throw new Error('Forbidden');
    await post.destroy();
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

export const getPostsByTopic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const offset = parseInt((req.query.offset as string) || '0', 10);
    const topik = req.query.topik as string;
    if (!topik) throw new Error('Topik is required');
    const { count, rows } = await Post.findAndCountAll({
      where: { topik },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    if (!rows || rows.length === 0) throw new Error('No posts found');
    const userIds = [...new Set(rows.map((p: any) => p.user_Id))];
    const users = await User.findAll({
      where: { user_Id: userIds },
      attributes: ["user_Id", "username", "profileImage"],
    });
    const userMap = new Map(
      users.map((u: any) => [u.user_Id, { username: u.username, profileImage: u.profileImage }])
    );
    const result = rows.map((post: any) => {
      const user = userMap.get(post.user_Id) || { username: "Unknown User", profileImage: null };
      return { ...post.toJSON(), username: user.username, profileImage: user.profileImage || null };
    });
    res.status(200).json({ data: result, total: count });
  } catch (error) {
    next(error);
  }
};

export const getPopularPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = parseInt((req.query.limit as string) || '10', 10);
    const offset = parseInt((req.query.offset as string) || '0', 10);
    const { count, rows } = await Post.findAndCountAll({
      limit,
      offset,
      order: [
        ['likePost', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });
    if (!rows || rows.length === 0) {
      res.status(200).json({ data: [], total: count || 0 });
      return;
    }
    const userIds = [...new Set(rows.map((p: any) => p.user_Id))];
    const users = await User.findAll({
      where: { user_Id: userIds },
      attributes: ["user_Id", "username", "profileImage"],
    });
    const userMap = new Map(
      users.map((u: any) => [u.user_Id, { username: u.username, profileImage: u.profileImage }])
    );
    const result = rows.map((post: any) => {
      const user = userMap.get(post.user_Id) || { username: "Unknown User", profileImage: null };
      return { ...post.toJSON(), username: user.username, profileImage: user.profileImage || null };
    });
    res.status(200).json({ data: result, total: count });
  } catch (error) {
    next(error);
  }
};






















// export const getUnlikedPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const limit = parseInt((req.query.limit as string) || '10', 10);
//     const offset = parseInt((req.query.offset as string) || '0', 10);
//     const { count, rows } = await Post.findAndCountAll({
//       where: { likePost: 0 },
//       limit,
//       offset,
//       order: [['createdAt', 'DESC']]
//     });
//     if (!rows || rows.length === 0) throw new Error('No posts found');
//     const userIds = [...new Set(rows.map((p: any) => p.user_Id))];
//     const users = await User.findAll({
//       where: { user_Id: userIds },
//       attributes: ["user_Id", "username", "profileImage"],
//     });
//     const userMap = new Map(
//       users.map((u: any) => [u.user_Id, { username: u.username, profileImage: u.profileImage }])
//     );
//     const result = rows.map((post: any) => {
//       const user = userMap.get(post.user_Id) || { username: "Unknown User", profileImage: null };
//       return { ...post.toJSON(), username: user.username, profileImage: user.profileImage || null };
//     });
//     res.status(200).json({ data: result, total: count });
//   } catch (error) {
//     next(error);
//   }
// };