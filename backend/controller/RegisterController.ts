
import { Request, Response, NextFunction } from "express";
import { User } from "../models/User"; 
import { v4 } from "uuid";
import bcrypt from "bcryptjs";

export const signup = async (req: Request): Promise<{ message: string }> => {
  const { email, password, username, gender } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw new Error("Username already taken");
  }

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({ 
    user_Id: v4(), 
    email, 
    password: hashedPassword, 
    username, 
    gender, 
    profileImage 
  });

  return { message: "User created successfully" };
};