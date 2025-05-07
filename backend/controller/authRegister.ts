import { Request, Response } from "express";
import { User } from "../models/User"; 
import { v4 } from "uuid";
import bcrypt from "bcryptjs";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password, username, gender} = req.body;
  const profileImage = req.file ? req.file.filename : null;
  
  try {
    const existingUser = await User.findOne({
      where: {
        username,
      },
    });
    
    if (existingUser) {
      res.status(400).json({ message: "Username already taken" })
      return
    }
    
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      res.status(400).json({ message: "Email already registered" })
      return 
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      user_id: v4(),
      email,
      password: hashedPassword,
      username,
      gender, 
      profileImage
    });

    res.status(201).json({ message: "User created successfully" })
    return 
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" })
    return 
  }
};