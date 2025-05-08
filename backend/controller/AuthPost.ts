import { Request, Response } from "express";
import { Post } from "../models/Post";
import { v4 } from "uuid";
import bcrypt from "bcryptjs"; // This doesn't seem to be needed in this route, unless you're encrypting data

export const post = async (req: Request, res: Response): Promise<void> => {
  const { title, post, topik, like, user_id } = req.body;

  // Check if all required fields are provided
  if (!title) {
    res.status(400).json({ message: "Title is required" });
    return;
  }

  if (!post) {
    res.status(400).json({ message: "Post content is required" });
    return;
  }

  if (!topik) {
    res.status(400).json({ message: "Topik is required" });
    return;
  }

  if (like === undefined) {
    res.status(400).json({ message: "Like is required" });
    return;
  }

  if (!user_id) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }


  try {
    // Create a new post in the database
    await Post.create({
      post_id: v4(),
      user_Id: user_id,  // Ensure 'user_Id' is correctly named
      title,
      post,
      like: 0,
      topik,
    });

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.findAll(); // Assuming you have a method to fetch all posts

    if (!posts) {
      res.status(404).json({ message: "No posts found" });
      return;
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
