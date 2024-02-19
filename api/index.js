import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectDB } from './utils/db.js';
import cookieParser from 'cookie-parser';

// Load environment variables
config();

const app = express();
const PORT = 4242;

// middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());

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
