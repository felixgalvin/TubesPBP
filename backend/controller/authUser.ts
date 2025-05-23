import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { Like } from "../models/Like";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../middlewares/AuthorizationMiddleware";

export const getUserData = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.userId;
  try {
    if (!userId) throw new Error("Unauthorized");
    const user = await User.findByPk(userId);
    const likes = await Like.findAll({ where: { user_Id: userId } });
    const likedPosts = likes.map((like) => like.post_Id);
    res.status(200).json({
      message: "User data fetched",
      data: {
        ...user?.toJSON(),
        likedPosts,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ where: { user_Id: userId } });
    if (!user) throw new Error("User not found");
    res.status(200).json({
      message: "User data fetched",
      data: {
        user_Id: user.user_Id,
        email: user.email,
        username: user.username,
        gender: user.gender,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.id;
  const { currentPassword } = req.body;
  try {
    if (!currentPassword) throw new Error('Current password required');
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new Error('Incorrect password');
    const updates: any = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.gender) updates.gender = req.body.gender;
    if (req.body.newPassword) {
      const newHash = await bcrypt.hash(req.body.newPassword, 10);
      updates.password = newHash;
    }
    if (req.file && req.file.filename) updates.profileImage = req.file.filename;
    await user.update(updates);
    res.status(200).json({ message: 'Profile updated', data: updates });
  } catch (error) {
    next(error);
  }
};
