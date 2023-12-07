import express from 'express';
import debug from 'debug';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ping, createUser, getUserById } from './database.js';

const debugServer = debug('app:Server');
const app = express();

//* Configure Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALL_BACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      //* Methods to create or authenticate use in our DB
      if (await getUserById(profile.id)) {
        debugServer('User already exits in DB');
      } else {
        createUser(profile);
      }
      return done(null, profile);
    }
  )
);

//* Save User into session (cookie)
passport.serializeUser((user, done) => {
  done(null, user);
});

//* Retrieve user from session (cookie)
passport.deserializeUser((user, done) => {
  done(null, user);
});

//* Setup the session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 360 },
  })
);

//* Setup passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send(
    `<h1>Please Navigate to <a href="http://localhost:3000/auth/google" target="_blank">Sign In</a> to login</h1>`
  );
});

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

//* callback route for google to redirect to
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

//* Display the user profile
app.get('/profile', (req, res) => {
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
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect('/');
});

app.listen(3000, () => {
  debugServer('http://localhost:3000');
});
