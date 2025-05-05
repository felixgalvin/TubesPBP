import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { c } from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";

const JWT_SECRET = "your_jwt_secret_key"; // Sebaiknya gunakan .env untuk menyimpan secret

export const getUserData = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1]; // Mengambil token dari header Authorization

  if (!token) {
    res.status(401).json({ message: "Token is required" });
    return
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    // Mengambil user berdasarkan user_id yang ada di dalam token
    const user = await User.findOne({ where: { user_id: decoded.userId } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return
    }

    // Kirimkan data pengguna yang berhasil ditemukan
    res.status(200).json({
      message: "User data fetched successfully", // Menambahkan pesan sukses
      data: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      }
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Menangani error jika token tidak valid atau ada kesalahan lainnya
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
      return
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id; // Mengambil user_id dari parameter URL

  try {
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return
    }

    res.status(200).json({
      message: "User data fetched",
      data: {
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      }
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
    return
  }
}
