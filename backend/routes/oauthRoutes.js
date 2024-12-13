import express from 'express';
import passport from 'passport';

const router = express.Router();

// Google Auth Routes
router.get('/auth/google', (req, res, next) => {
    console.log('Google OAuth: Initiating authentication');
    next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  (req, res, next) => {
    console.log('Google OAuth: Callback received');
    console.log(`Callback Query: ${JSON.stringify(req.query)}`);
    console.log(`Request Session at callback start: ${JSON.stringify(req.session)}`);
    next();
  },
  passport.authenticate('google', { failureRedirect: 'https://alemumolla-ecommerce.netlify.app/signin' }),
  (req, res, next) => {
    console.log('Google OAuth: User authenticated, redirecting to client');
    console.log('Authenticated user:', req.user);
    if (!req.user) {
      console.error('Google OAuth: Authentication failed, no user found');
      return res.redirect('https://alemumolla-ecommerce.netlify.app/signin');
    }
    req.logIn(req.user, (err) => {
      if (err) {
        console.error('Google OAuth: Error logging in user', err);
        return next(err);
      }
      console.log('Google OAuth: User logged in successfully, redirecting to home page');
      console.log('Session:', req.session);
      res.redirect('https://alemumolla-ecommerce.netlify.app');
    });
  }
);

// GitHub Auth Routes
router.get('/auth/github', (req, res, next) => {
    console.log('GitHub OAuth: Initiating authentication');
    next();
}, passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
  (req, res, next) => {
    console.log('GitHub OAuth: Callback received');
    console.log(`Callback Query: ${JSON.stringify(req.query)}`);
    console.log(`Request Session at callback start: ${JSON.stringify(req.session)}`);
    next();
  },
  passport.authenticate('github', { failureRedirect: 'https://alemumolla-ecommerce.netlify.app/signin' }),
  (req, res, next) => {
    console.log('GitHub OAuth: User authenticated, redirecting to client');
    console.log('Authenticated user:', req.user);
    if (!req.user) {
      console.error('GitHub OAuth: Authentication failed, no user found');
      return res.redirect('https://alemumolla-ecommerce.netlify.app/signin');
    }
    req.logIn(req.user, (err) => {
      if (err) {
        console.error('GitHub OAuth: Error logging in user', err);
        return next(err);
      }
      console.log('GitHub OAuth: User logged in successfully, redirecting to home page');
      console.log('Session:', req.session);
      res.redirect('https://alemumolla-ecommerce.netlify.app');
    });
  }
);

export default router;
