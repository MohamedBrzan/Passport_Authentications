import passport from 'passport';
import { Router } from 'express';
import User from './userModel.js';
import userModel from './userModel.js';
import jwt from 'jsonwebtoken';

const router = Router();

// router.get('/', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     let user = await User.findOne({ email });

//     if (user) return res.status(500).json({ error: 'User Already Exists' });

//     user = await User.create({
//       username,
//       email,
//       password,
//     });
//     res.status(200).json({
//       msg: 'success',
//       user,
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

router.post('/register', (req, res, next) => {
  passport.authenticate('local', async (err, user) => {
    const { name, username, password } = req.body;

    if (user)
      return res.status(401).json({
        message: 'User already registered',
      });
    user = await userModel.create({
      username: name,
      email: username,
      password,
    });

    return res.status(200).json(user);
  })(req, res, next);
});

router.get('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err)
      return res.status(401).json({
        message:
          'Access Denied. email or password is incorrect. please try again.',
      });
    if (!user) return res.status(401).json({ message: 'User Not Authorized' });
    return req.logIn(user, (err) => {
      if (err) return res.status(401).json({ error: err });
      return res.status(200).json(user);
    });
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err)
      return res.status(401).json({
        message:
          'Access Denied. email or password is incorrect. please try again.',
      });
    if (!user)
      return res.status(401).json({ message: 'You Already Logged Out' });
    return req.logOut(user, (err) => {
      if (err) return res.status(401).json({ error: err });
      res.status(200).json({ msg: 'Logged out successfully' });
    });
  })(req, res, next);
});

export default router;
