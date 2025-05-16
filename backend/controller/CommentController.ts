import { Request, Response } from "express";
import { v4 } from "uuid";
import bcrypt from "bcryptjs";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment"; // Ensure Comment model is imported
import { User } from "../models/User"; // Ensure User model is imported
import { Reply } from "../models/Reply";

// Backend: getPostDetails
export const getPostDetails = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  console.log("Get detail postId:", postId);

  try {
    const post = await Post.findOne({
      where: { post_id: postId },
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Ambil user berdasarkan user_Id dari post
    const user = await User.findOne({
      where: { user_id: post.user_Id },
    });

    // Kirim post + username + profileImage apa adanya (bisa null)
    const result = {
      ...post.toJSON(),
      username: user?.username || "Unknown User",
      profileImage: user?.profileImage || null, // tidak pakai defaultProfileImage
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching post details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Backend: getCommentsByPostManual
export const getCommentsByPostManual = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    // Ambil semua komentar untuk post tertentu
    const comments = await Comment.findAll({ where: { post_Id: postId } });

    // Ambil semua user_id unik dari komentar
    const userIds = [...new Set(comments.map(comment => comment.user_Id))];

    // Ambil data user berdasarkan user_id
    const users = await User.findAll({
      where: { user_id: userIds },
    });

    // Buat map userId => { username, profileImage }
    const userMap = new Map(
      users.map(user => [
        user.user_id,
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

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get comments with usernames and profile images', details: err });
  }
};



export const addComment = async (req: Request, res: Response) => {
    const { user_Id, comment } = req.body;
    const postId = req.params.postId;

    try {
        const newComment = await Comment.create({
            comment_id: v4(),
            user_Id,
            post_Id: postId,
            comment,
            likeComment: 0,
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Tambah reply ke comment tertentu
export const addReplyToComment = async (req: Request, res: Response) => {
  const { postId, commentId } = req.params;
  const { user_Id, commentReply } = req.body;
  try {
    const newReply = await Reply.create({
      reply_id: v4(),
      user_Id,
      post_Id: postId,
      comment_Id: commentId,
      commentReply,
      likeReply: 0,
    });
    res.status(201).json(newReply);
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Ambil semua reply untuk comment tertentu
export const getRepliesByComment = async (req: Request, res: Response) => {
  const { postId, commentId } = req.params;
  try {
    const replies = await Reply.findAll({
      where: { post_Id: postId, comment_Id: commentId },
    });
    // Ambil semua user unik
    const userIds = [...new Set(replies.map(r => r.user_Id))];
    const users = await User.findAll({ where: { user_id: userIds } });
    const userMap = new Map(users.map(u => [u.user_id, { username: u.username, profileImage: u.profileImage || null }]));
    const result = replies.map(r => {
      const userData = userMap.get(r.user_Id);
      return {
        ...r.toJSON(),
        username: userData?.username || 'Unknown User',
        profileImage: userData?.profileImage || null,
      };
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching replies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

