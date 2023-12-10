import { Router } from 'express';
import { passport } from '../index.js';

const router = Router();

router.get(
  '/google/auth',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

//* callback route for google to redirect to
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/google/profile',
    failureRedirect: '/',
  })
);

//* Display the user profile
router.get('/google/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      `<h1>You're logged in </h1><pre>${JSON.stringify(
        req.user,
        null,
        2
      )}</pre> `
    );
  } else {
    res.redirect('/');
  }
});

//* Logout the user
router.get('/google/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect('/');
});

export default router;
