import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./AuthRoutes"; // GANTI sesuai nama file router kamu
import { Sequelize } from "sequelize-typescript";
import config from "../config/config.json";
import{User} from "../models/User";
import{Reply} from "../models/Reply";
import{Post} from "../models/Post";
import{Comment} from "../models/Comment";
import { Dialect } from "sequelize"; // Add this import if not already present

const sequelize = new Sequelize({
  ...config.development,
  dialect: "postgres",
  models: [User, Reply,] // Explicitly cast dialect to Dialect type
});

sequelize.addModels([User]);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// REGISTER ROUTES
app.use("/api", userRoutes); // INI WAJIB AGAR /register bisa diakses


async function getUserById(user_id: string) {
  await sequelize.sync();
  
  const user = await User.findAll({
      where: {user_id}
  })
  return user;
}

app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return next(new Error("ToDoNotFound"));
    }

    res.status(200).json(user);
    return;
  } catch (err) {
    next(err);
  }
});

app.get("/users", async (req, res, next) => {
  try {
    const users = await User.findAll();

    if (!users) {
      return next(new Error("UserNotFound"));
    }

    res.status(200).json(users);
    return;

  } catch (err) {
    next(err);
  }
});

app.get("/users", async (req, res, next) => {
  try {
    const users = await User.findAll();

    if (!users) {
      return next(new Error("UserNotFound"));
    }

    res.status(200).json(users);
    return;

  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

