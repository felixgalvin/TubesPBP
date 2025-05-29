import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize-typescript";
import config from "./config/config.json";
import { User } from "./models/User";
import { Reply } from "./models/Reply";
import { Post } from "./models/Post";
import { Comment } from "./models/Comment";
import { Like } from "./models/Like";
import publicRoutes from "./routes/AuthPublicRoutes";
import privateRoutes from "./routes/AuthPrivateRoutes";
import { errorHandlerMiddleware } from "./middlewares/ErrorHandlerMiddleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  ...config.development,
  dialect: "postgres",
  models: [User, Reply, Post, Comment, Like],
  logging: console.log, // Enable SQL logging
});

sequelize.addModels([User, Reply, Post, Comment, Like]);

const app = express();
const PORT = 3000;

// Test database connection
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../user_uploads")));

app.use("/api", publicRoutes);
app.use("/api", privateRoutes);

// Error handler (should be last)
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


