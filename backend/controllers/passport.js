import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/user.js'; // Adjust the path if needed
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://mern-backend-pigq.onrender.com/api/auth/google/callback',
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google Strategy: Received profile:', profile);
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0]?.value || `${profile.id}@gmail.com`,
                accessToken: accessToken,
                refreshToken: refreshToken
            });
            await user.save();
            console.log('Google Strategy: Created new user:', user);
        } else {
            console.log('Google Strategy: Found existing user:', user);
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        console.error('Error in Google Strategy:', err);
        return done(err, false);
    }
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'https://mern-backend-pigq.onrender.com/api/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('GitHub Strategy: Received profile:', profile);
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
            user = new User({
                githubId: profile.id,
                name: profile.displayName,
                email: profile.emails?.[0]?.value || `${profile.id}@github.com`,
                accessToken: accessToken,
                refreshToken: refreshToken
            });
            await user.save();
            console.log('GitHub Strategy: Created new user:', user);
        } else {
            console.log('GitHub Strategy: Found existing user:', user);
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        console.error('Error in GitHub Strategy:', err);
        return done(err, false);
    }
}));

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        console.log('Deserializing user:', user);
        done(null, user);
    } catch (err) {
        console.error('Error deserializing user:', err);
        done(err, null);
    }
});

export default passport;
