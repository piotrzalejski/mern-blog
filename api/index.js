import express from 'express';
import cors from 'cors';
import User from './models/User.js';
import Post from './models/Post.js';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectDB } from './utils/db.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config();

const app = express();
const PORT = 4242;

// middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

const uploadMidware = multer({ dest: 'uploads/' });

// start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

startServer();

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username: username, password: hashedPassword });
    res.json(`User ${username} registered successfully!`);
  } catch (error) {
    console.log(error);
    res.status(400).json(`Error: ${error}`);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log('attempting login...');
    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(400).json('User not found');
      return;
    } else if (await bcrypt.compare(password, user.password)) {
      console.log('Password match');
      jwt.sign(
        { username, id: user._id },
        process.env.JWT_SECRET,
        (err, token) => {
          if (err) res.status(400).json(`Error: ${err}`);
          res.cookie('token', token).json({ username, id: user._id });
        }
      );
    } else {
      res.status(400).json('Invalid password');
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(`Error: ${error}`);
  }
});

app.get('/profile', async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).json('Not authorized');
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) res.status(400).json(`Error: ${err}`);
    res.json(decoded);
  });
});

app.post('/logout', (req, res) => {
  res.clearCookie('token').json('Logged out');
});

app.post('/posts', uploadMidware.single('image'), async (req, res) => {
  const { title, summary, content } = req.body;
  try {
    if (!title || !summary || !content) {
      throw new Error('Title, summary, and content are required');
    }
    if (!req.file) {
      throw new Error('Image is required');
    }

    // saving image with original extension into uploads folder
    const { originalname, path: oldPath } = req.file;
    const ext = originalname.split('.').pop();
    const newPath = oldPath + '.' + ext;
    fs.renameSync(oldPath, newPath);

    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) res.status(400).json(`Error: ${err}`);
      // create post, save to db
      const postDoc = await Post.create({
        title: title,
        summary: summary,
        content: content,
        image: newPath,
        author: decoded.id,
      });
      res.json(postDoc);
    });
  } catch (error) {
    console.error(error);
    res.status(400).json(`Error: ${error}`);
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(400).json(`Error: ${error}`);
  }
});
