
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { Like } from "../models/Like";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../middlewares/AuthorizationMiddleware";

export const getUserData = async (req: AuthRequest) => {
  console.log('getUserData called with userId:', req.userId);
  
  const userId = req.userId;

  if (!userId) {
    console.log('No userId provided');
    throw new Error("Unauthorized");
  }

  const user = await User.findByPk(userId);
  console.log('User found:', user ? 'Yes' : 'No');

  if (!user) {
    console.log('User not found in database');
    throw new Error("User not found");
  }

  const likes = await Like.findAll({ where: { user_Id: userId } });

  // Categorize likes by type
  const likedPosts = likes
    .filter(like => like.post_Id)
    .map(like => like.post_Id);
  
  const likedComments = likes
    .filter(like => like.comment_Id)
    .map(like => like.comment_Id);
  
  const likedReplies = likes
    .filter(like => like.reply_Id)
    .map(like => like.reply_Id);

  console.log('Returning user data for:', user.username);

  return {
    message: "User data fetched",
    data: { 
      ...user?.toJSON(), 
      likedPosts, 
      likedComments, 
      likedReplies 
    }
  };
};

export const getUserById = async (req: Request) => {
  const userId = req.params.id;
  
  const user = await User.findOne({ where: { user_Id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  return {
    message: "User data fetched",
    data: {
      user_Id: user.user_Id,
      email: user.email,
      username: user.username,
      gender: user.gender,
      profileImage: user.profileImage,
      createdAt: user.createdAt
    }
  };
};

export const updateUserProfile = async (req: Request) => {
  const userId = req.params.id;
  const { currentPassword } = req.body;

  if (!currentPassword) {
    throw new Error('Current password required');
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    throw new Error('Incorrect password');
  }
  // Prepare updates
  const updates: any = {};
  if (req.body.username) {
    updates.username = req.body.username;
  }
  if (req.body.email) {
    updates.email = req.body.email;
  }
  if (req.body.gender) {
    updates.gender = req.body.gender;
  }
  if (req.body.newPassword) {
    updates.password = await bcrypt.hash(req.body.newPassword, 10);
  }
  
  // Handle profile image updates
  if (req.body.removeProfileImage === 'true') {
    updates.profileImage = null; // Remove profile image (set to default)
  } else if (req.file?.filename) {
    updates.profileImage = req.file.filename; // Set new profile image
  }
  await user.update(updates);

  // Return updated user data
  const updatedUser = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  return { 
    message: 'Profile updated', 
    data: updatedUser
  };
};
