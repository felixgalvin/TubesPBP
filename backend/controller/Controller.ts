// import express from 'express';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';
// import jwt from 'jsonwebtoken';
// import { Sequelize } from 'sequelize-typescript';
// // import bcrypt from 'bcrypt';
// import { Op } from 'sequelize';
// import { Request, Response, NextFunction } from "express";
// import { User } from '../models/User';
// import { Comment } from '../models/Comment';
// import { Post } from '../models/Post';
// import { Reply } from '../models/Reply';
// import { Session } from '../models/Session';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: User;
//     }
//   }
// }

// const config = require('./config/config.json');
// const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// const sequelize = new Sequelize({
//   ...config.development,
//   models: [User, Post, Comment, Reply, Session], 
// });

// User.hasMany(Tweet, { foreignKey: 'user_id' });
// Tweet.belongsTo(User, { foreignKey: 'user_id' });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique file name
//   },
// });
// const upload = multer({ storage: storage });

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// //================================================= Autentication =================================================

// const authenticate = (req: Request, res: Response, next: NextFunction) => {
//   (async () => {
//     try {
//       if (req.path === "/login" || req.path === "/register" || req.path === "/refresh") {
//         return next();
//       }

//       const authorization = req.headers.authorization;
//       if (!authorization) {
//         return res.status(401).json({ error: 'Authorization header missing' });
//       }

//       const token = authorization.split(" ")[1];
//       if (!token) {
//         return res.status(401).json({ error: 'Token missing' });
//       }

//       const decoded = jwt.verify(token, secretKey) as { userId: string };
//       const user = await User.findByPk(decoded.userId);

//       console.log("Decoded user:", decoded);
//       console.log("User found:", user);

//       if (!user) {
//         return res.status(401).json({ error: 'User not found' });
//       }

//       req.user = user;
//       next();
//     } catch (err) {
//       return res.status(401).json({ error: 'Unauthorized - Invalid token' });
//     }
//   })();
// };


// app.use(authenticate);


// app.post("/register", upload.single('profilePicture'), async (req: Request, res: Response) => {
//   try {
//     console.log('req.body:', req.body); // <-- Tambahkan ini
//     console.log('req.file:', req.file);


//     const { username, password, name, email } = req.body;
//     const file = req.file;

//     if (!username || !password || !name || !email) {
//       return res.status(400).json({ error: "Semua field wajib diisi!" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       user_id: uuidv4(),
//       username,
//       password: hashedPassword,
//       name,
//       email,
//       profilePicture: file ? file.path : null,
//     });

//     res.status(201).json({ message: "User created successfully" });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// /**
//  * Login user
//  */
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const loginIdentifier = email; // Support both fields
//     if (!loginIdentifier || !password) {
//       return res.status(400).json({ error: "Missing username/email or password" });
//     }

//     // Find user by username or email
//     const user = await User.findOne({
//       where: {
//         [Op.or]: [
//           { email: loginIdentifier }
//         ]
//       }
//     });

//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const token = jwt.sign({ userId: user.user_id }, secretKey, { expiresIn: "1h" });

//     res.json({ message: "Login successful", token });
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// //================================================= POST =================================================
// app.post("/post", async (req, res) => {
//   try {
//     const { user_id,content, image_path } = req.body;
 
//     if (!content) {
//       return res.status(400).json({ error: "Content is required" });
//     }

//     const tweet = await Tweet.create({
//       tweet_id: uuidv4(),
//       user_id: user_id,
//       content : content,
//       image_path : image_path || null,
//       reply_id : null,
//     });

//     res.status(201).json(tweet);
//   } catch (error) {
//     console.error("Error creating post:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// //================================================= Autentication =================================================
// sequelize.authenticate()
//   .then(() => {
//     console.log('Database connected.');
//     app.listen(3000, () => {
//       console.log('Server is running on port 3000');
//     });
//   })
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err);
//   });