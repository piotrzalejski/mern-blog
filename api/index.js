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
import { refreshAccessToken } from './utils/middleware.js';

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
    console.error('Error starting server: ', error);
  }
};

startServer();

// Routes don't require authentication
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json('Username and password are required');
    }
    const user = await User.findOne({ username: username });
    if (user) {
      return res.status(400).json('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username: username, password: hashedPassword });
    res.json(`User ${username} registered successfully!`);
  } catch (error) {
    console.error('Registration error: ', error);
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log('attempting login...');
    if (!username || !password) {
      return res.status(400).json('Username and password are required');
    }
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json('User not found');
    } else if (await bcrypt.compare(password, user.password)) {
      console.log('Password match');
      const token = jwt.sign(
        { username, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );
      res
        .cookie('sessionCookie', token, { httpOnly: true, secure: false })
        .json({
          message: 'Login successful',
          user: { username: username, id: user._id },
        });
      console.log('Login successful. JWT Signed');
    } else {
      return res.status(400).json({ error: 'Invalid password' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ errror: 'Internal server error' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('sessionCookie').json('Logged out');
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', '-_id username')
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-__v');
    res.json(posts);
  } catch (error) {
    console.error('Fetching posts error: ', error);
    res.status(400).json({ error: 'Fetching posts failed' });
  }
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate('author', ['username']);
    res.json(post);
  } catch (error) {
    console.error('Fetching post error: ', error);
    res.status(400).json({ error: 'Fetching post failed' });
  }
});

// Routes requiring authentication
app.use(refreshAccessToken);
app.get('/profile', refreshAccessToken, async (req, res) => {
  const { sessionCookie } = req.cookies;
  if (!sessionCookie) {
    console.log('No session token found');
    return res.status(401).json('Unauthorized. No session token found');
  }
  jwt.verify(sessionCookie, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT Verification Error: ', err);
      return res.status(401).json({ error: 'Token verification failed' });
    }
    // console.log('decoded: ', decoded);
    res.json({
      message: 'Authorized',
      user: { username: decoded.username, id: decoded.id },
    });
  });
});

app.post(
  '/post',
  uploadMidware.single('image'),
  refreshAccessToken,
  async (req, res) => {
    const { title, summary, content } = req.body;
    let newPath = null;
    try {
      if (!title || !summary || !content) {
        throw new Error('Title, summary, and content are required');
      }
      // if (!req.file) {
      //   throw new Error('Image is required');
      // }

      if (req.file && req.file !== undefined) {
        // saving image with original extension into uploads folder
        const { originalname, path: oldPath } = req.file;
        const ext = originalname.split('.').pop();
        newPath = oldPath + '.' + ext;
        fs.renameSync(oldPath, newPath);
      }

      const { sessionCookie } = req.cookies;
      jwt.verify(
        sessionCookie,
        process.env.JWT_SECRET,
        async (err, decoded) => {
          if (err) {
            console.error('JWT Verification Error: ', err);
            res.status(400).json({ error: 'Token verification error' });
          }
          // create post, save to db
          if (newPath === null) {
            newPath = '';
          }
          const postDoc = await Post.create({
            title: title,
            summary: summary,
            content: content,
            image: newPath,
            author: decoded.id,
          });
          res.json(postDoc);
        }
      );
    } catch (error) {
      console.error('Post creation error: ', error);
      res.status(400).json({ error: 'Post creation failed' });
    }
  }
);

app.put('/post', uploadMidware.single('image'), async (req, res) => {
  let newPath = null;

  if (req.file) {
    const { originalname, path: oldPath } = req.file;
    const ext = originalname.split('.').pop();
    newPath = oldPath + '.' + ext;
    fs.renameSync(oldPath, newPath);
  }

  const { sessionCookie } = req.cookies;
  console.log('session cookie: ', sessionCookie);

  const decoded = req.decoded;
  console.log('decoded: ', decoded);

  const { id, title, summary, content } = await req.body;
  console.log('put data: ', { id, title, summary, content });

  const postDoc = await Post.findById(id);
  if (!postDoc) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (JSON.stringify(postDoc.author) !== JSON.stringify(decoded.id)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    // Update the post document
    const updatedDoc = await Post.findOneAndUpdate(
      { _id: id },
      {
        title,
        summary,
        content,
        image: newPath ? newPath : postDoc.image,
      },
      { new: true }
    );

    console.log('updatedPostDoc: ', updatedDoc);
    return res.json(updatedDoc); // Response sent here
  } catch (error) {
    console.error('Error updating post:', error);
    return error;
  }
});
