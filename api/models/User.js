import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    min: 4,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    min: 6,
  },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
