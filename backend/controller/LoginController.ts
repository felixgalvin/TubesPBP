// controller/authLogin.ts

import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/app";

export const login = async (req: Request, res: Response, next: NextFunction): Promise<{ token: string }> => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const expiresIn = Math.floor(appConfig.jwtExpiry / 1000);
  const token = jwt.sign(
    { userId: user.user_Id },
    appConfig.jwtSecret,
    { expiresIn }
  );

  return { token };
};