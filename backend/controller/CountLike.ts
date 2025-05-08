import { Request, Response } from "express";
import { Post } from "../models/Post";
import { v4 } from "uuid";
import bcrypt from "bcryptjs";

export const countLike = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.postId; // Assuming you're passing the post ID in the URL

  try {
    // Find the post by ID
    const post = await Post.findOne({ where: { post_id: postId } });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Increment the like count
    post.like += 1;
    await post.save();

    res.status(200).json({ message: "Like count updated", like: post.like });
  } catch (error) {
    console.error("Error updating like count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}