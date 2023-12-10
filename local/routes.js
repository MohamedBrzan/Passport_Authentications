import { Router } from 'express';
import User from './userModel.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({
      username,
      email,
      password,
    });
    res.status(200).json({
      msg: 'success',
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

export default router;
