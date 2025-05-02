import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./authRoutes"; // GANTI sesuai nama file router kamu
import { Sequelize } from "sequelize-typescript";
import config from "../config/config.json";
import{User} from "../models/User";
import{Reply} from "../models/Reply";
import{Post} from "../models/Post";
import{Comment} from "../models/Comment";


// const config = require("../config/config.json");

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
app.use("/", userRoutes); // INI WAJIB AGAR /register bisa diakses

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
