import { Router } from 'express';
import { passport } from '../index.js';

const router = Router();

router.get('/facebook/auth', passport.authenticate('facebook'));

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/facebook/profile',
    failureRedirect: '/',
  })
);

router.get('/facebook/profile', (req, res) => {
  if (req.isAuthenticated()) {
    return res.send(
      `<h1>You're Logged In</h1> <pre>${JSON.stringify(
        req.user,
        null,
        2
      )}</pre>`
    );
  }
  return res.redirect('/');
});

router.get('/facebook/logout', (req, res) => {
  req.logout((err) => (err ? next(err) : res.redirect('/')));
});

export default router;
