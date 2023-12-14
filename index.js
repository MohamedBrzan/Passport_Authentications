import express from 'express';
import debug from 'debug';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import mongoDatabase from './local/DB.js';
import routes from './local/routes.js';
// import Facebook from './facebook/facebook.js';
// import Google from './google/google.js';
// import { ping, createUser, getUserById } from './google/database.js';
import { Strategy as LocalStrategy } from 'passport-local';

mongoDatabase();

const debugServer = debug('app:server');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// import * as Linkedin from './linkedin/linkedin';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// //* Configure Facebook Passport
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: process.env.FACEBOOK_CALL_BACK_URL,
//       profileFields: ['id', 'displayName', 'photos', 'email'],
//       enableProof: true,
//     },
//     async (accessToken, refreshToken, profile, done) => done(null, profile)
//   )
// );

// //* Configure Google Passport
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALL_BACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       //* Methods to create or authenticate use in our DB
//       if (await getUserById(profile.id)) {
//         debugServer('User already exits in DB');
//       } else {
//         createUser(profile);
//       }
//       return done(null, profile);
//     }
//   )
// );

//* Configure Local Passport

// passport.use(
//   new LocalStrategy(
//     { passReqToCallback: true },
//     (req, username, password, done) => {
//       console.log('yes', { username, password });
//       return done(null, { username, password });
//     }
//   )
// );

passport.use(
  new LocalStrategy({ passReqToCallback: true }, function (
    req,
    username,
    password,
    done
  ) {
    return done(null, { email: username, password });
  })
);

//* Save User into session (cookie)
passport.serializeUser((user, done) => done(null, user));
//* Retrieve user from session (cookie)
passport.deserializeUser((user, done) => done(null, user));

//* Setup the session middleware
app.use(
  session({
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 60 * 24 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send(`
 <h1><a href="http://localhost:3000/facebook/auth" target="_blank">Facebook</a> </h1>
 <h1><a href="http://localhost:3000/google/auth" target="_blank">Google</a> </h1>
 <h1><a href="http://localhost:3000/linkedin/auth" target="_blank">Linkedin</a> </h1>
 `);
});

app.use('/api/v1', routes);
// app.use('/', Facebook);
// app.use('/', Google);

app.listen(3000, () =>
  debugServer('App is listening on http://localhost:3000')
);
