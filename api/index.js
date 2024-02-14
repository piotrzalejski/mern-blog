import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectDB } from './utils/db.js';

config();

const app = express();
const PORT = 4242;

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/register', async (req, res) => {
  const { userName, password } = req.body;
  try {
    await connectDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username: userName, password: hashedPassword });
    res.json(`User ${userName} registered successfully!`);
  } catch (error) {
    console.log(error);
    res.status(400).json(`Error: ${error}`);
  }
});

app.post('/login', async (req, res) => {
  const { userName, password } = req.body;
  try {
    await connectDB();
    const user = await User.findOne({ username: userName });
    if (!user) {
      res.status(400).json('User not found');
      return;
    } else if (await bcrypt.compare(password, user.password)) {
      console.log('Password match');
      jwt.sign({ userName }, process.env.JWT_SECRET, (err, token) => {
        if (err) res.status(400).json(`Error: ${err}`);
        res.cookie('token', token).json('Logged in successfully');
      });
    } else {
      res.status(400).json('Invalid password');
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(`Error: ${error}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
