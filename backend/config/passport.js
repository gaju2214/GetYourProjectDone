const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

console.log('Setting up Google OAuth strategy...');

// Test model accessibility
console.log('User model loaded:', !!User);
if (User) {
  console.log('User table name:', User.tableName || 'default');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔍 Google profile:', profile);

        // Check if emails exist
        if (!profile.emails || profile.emails.length === 0) {
          console.error(' No email found in Google profile');
          return done(new Error('No email provided by Google'), null);
        }

        let user = await User.findOne({ where: { googleId: profile.id } });
        if (user) {
          console.log(' Found existing user with googleId');
          return done(null, user);
        }

        user = await User.findOne({ where: { email: profile.emails[0].value } });
        if (user) {
          console.log('Linking Google account to existing user');
          user.googleId = profile.id;
          user.provider = 'google';
          await user.save();
          return done(null, user);
        }

        console.log(' Creating new user from Google profile');
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          provider: 'google',
        });

        return done(null, user);
      } catch (error) {
        console.error(' Error in GoogleStrategy:', error);
        console.error('SQL Error:', error.sql);
        console.error(' Original Error:', error.original);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id, 'Type:', typeof user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log(' Deserializing user with ID:', id, 'Type:', typeof id);
    
    // Validate ID
    if (!id) {
      console.error('ID is null/undefined in deserializeUser');
      return done(null, false);
    }

    // Convert to proper type if needed
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    if (isNaN(userId)) {
      console.error(' Invalid ID format in deserializeUser:', id);
      return done(null, false);
    }

    console.log('Looking for user with ID:', userId);
    const user = await User.findOne({ 
      where: { id: userId },
      // Add some debugging
      logging: console.log
    });

    if (user) {
      console.log(' User found in deserialize:', user.id);
    } else {
      console.warn(' User not found in deserialize for ID:', userId);
    }
    
    done(null, user);
  } catch (error) {
    console.error('Error in deserializeUser:', error);
    console.error('Error message:', error.message);
    console.error(' SQL:', error.sql);
    console.error(' Original error:', error.original);
    
    // Don't pass the error to done() in deserialize as it can cause session issues
    // Instead, just return null user
    done(null, null);
  }
});

module.exports = passport;



