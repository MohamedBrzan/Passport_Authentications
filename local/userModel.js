import { Schema, model } from 'mongoose';

const User = new Schema(
  {
    username: { type: String, default: '' },
    email: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);

export default model('UserModel', User);
