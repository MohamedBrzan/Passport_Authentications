import express from 'express';
import session from 'express-session';
import debug from 'debug';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

const debugServer = debug('app:server');

const app = express();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALL_BACK_URL,
      profileFields: ['id', 'displayName', 'photos', 'email'],
      enableProof: true,
    },
    async (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) =>
  res.send(
    `<h1>Please Navigate to <a href="http://localhost:3000/auth/facebook" target="_blank">Sign In</a> to login</h1>`
  )
);

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => res.redirect('/profile')
);

app.get('/profile', (req, res) => {
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

app.get('/logout', (req, res) => {
  req.logout((err) => (err ? next(err) : res.redirect('/')));
});

app.listen(3000, () =>
  debugServer('App is listening on http://localhost:3000')
);
