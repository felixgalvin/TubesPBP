import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/app";
import { middlewareWrapper } from "../utils/MiddlewareWrapper";
import { User } from "../models/User";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authorizationMiddleware = middlewareWrapper(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      res.locals.errorCode = 401;
      throw new Error("No token provided");
    }
    try {
      const result = jwt.verify(token, appConfig.jwtSecret);
      const userId = (result as any).userId as string;
      if (!userId) {
        res.locals.errorCode = 401;
        throw new Error("Invalid token");
      }
      const user = await User.findByPk(userId);
      if (!user) {
        res.locals.errorCode = 401;
        throw new Error("User not found");
      }
      req.userId = userId; // assign userId for controllers
      res.locals.user = user;
    } catch (err) {
      res.locals.errorCode = 401;
      throw new Error("Something went wrong");
    }
  }
);