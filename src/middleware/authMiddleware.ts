import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model"; // Adjust the path as needed
import dotenv from "dotenv";

dotenv.config();

export interface IGetUserAuthInfoRequest extends Request {
	user?: object;
   }

const authMiddleware = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from headers
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret") as { userId: string };

    // Find user by decoded ID
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
