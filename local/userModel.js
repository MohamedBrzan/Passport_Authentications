import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const User = new Schema(
  {
    username: { type: String, default: '' },
    email: { type: String },
    password: { type: String },
  },
  { timestamps: true }
);

User.pre('save', async function (next) {
  if (this.isModified('password')) {
    console.log(this.password);
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

User.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default model('UserModel', User);
