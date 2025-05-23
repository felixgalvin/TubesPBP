import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Sequelize } from "sequelize-typescript";
import config from "../config/config.json";
import { User } from "../models/User";
import { Reply } from "../models/Reply";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { Like } from "../models/Like";
import publicRoutes from "./AuthPublicRoutes";
import privateRoutes from "./AuthPrivateRoutes";
import { errorHandlerMiddleware } from "../middlewares/ErrorHandlerMiddleware";

const sequelize = new Sequelize({
  ...config.development,
  dialect: "postgres",
  models: [User, Reply, Post, Comment, Like],
});

sequelize.addModels([User, Reply, Post, Comment, Like]);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Public routes (no auth required)
app.use("/api", publicRoutes);
// Private routes (with auth middleware inside the router)
app.use("/api", privateRoutes);

// Error handler (should be last)
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


