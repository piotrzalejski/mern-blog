import mongoose, { Schema } from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    summary: {
      type: String,
      required: [true, 'Please provide a summary'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    image: {
      // path to the image
      type: String,
      // required: [true, 'Please provide an image'],
    },
    author: {
      // username of the author
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide an author'],
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post;
