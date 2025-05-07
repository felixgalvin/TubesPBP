import { Request, Response } from "express";
import { Post } from "../models/Post"; 
import { v4 } from "uuid";
import bcrypt from "bcryptjs";

export const post = async (req: Request, res: Response): Promise<void> => {
  const { title, post, topik} = req.body;
  const user_id = req.body.user_id;
  try {
    await Post.create({
      post_id: v4(),
      title,
      post,
      topik,
      user_id 
    });

    res.status(201).json({ message: "Post created successfully" })
    return 
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" })
    return 
  }
};