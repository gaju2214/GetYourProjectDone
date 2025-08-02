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
    async (accessToken, refreshToken, profile, done) => { // Fixed: Added missing parameters
      try {
        console.log('🔍 Google profile received:', {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
          photos: profile.photos
        });

        // Check if emails exist and handle different profile structures
        let email = null;
        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        } else if (profile._json && profile._json.email) {
          email = profile._json.email;
        }

        if (!email) {
          console.error('❌ No email found in Google profile');
          return done(new Error('No email provided by Google'), null);
        }

        console.log('📧 Using email:', email);

        // Check if user exists by Google ID
        let user = await User.findOne({ 
          where: { googleId: profile.id },
          logging: false // Disable SQL logging for cleaner output
        });

        if (user) {
          console.log('✅ Found existing user with googleId:', user.id);
          return done(null, user);
        }

        // Check if user exists by email
        user = await User.findOne({ 
          where: { email: email },
          logging: false
        });

        if (user) {
          console.log('🔗 Linking Google account to existing user:', user.id);
          user.googleId = profile.id;
          user.provider = 'google';
          await user.save();
          return done(null, user);
        }

        // Create new user
        console.log('👤 Creating new user from Google profile');
        const userData = {
          googleId: profile.id,
          name: profile.displayName || 'Google User',
          email: email,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          provider: 'google',
         
        };

        console.log('📝 User data to create:', userData);

        user = await User.create(userData);
        console.log('✅ New user created with ID:', user.id);

        return done(null, user);
      } catch (error) {
        console.error('❌ Error in GoogleStrategy:', error.message);
        if (error.sql) {
          console.error('🗄️ SQL Error:', error.sql);
        }
        if (error.original) {
          console.error('🔍 Original Error:', error.original.message || error.original);
        }
        return done(error, null);
      }
    }
  )
);

// passport.serializeUser((user, done) => {
//   console.log('📦 Serializing user:', user.id, 'Type:', typeof user.id);
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     console.log('📂 Deserializing user with ID:', id, 'Type:', typeof id);
    
//     // Validate ID
//     if (!id) {
//       console.error('❌ ID is null/undefined in deserializeUser');
//       return done(null, false);
//     }

//     // Convert to proper type if needed
//     const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    
//     if (isNaN(userId)) {
//       console.error('❌ Invalid ID format in deserializeUser:', id);
//       return done(null, false);
//     }

//     console.log('🔍 Looking for user with ID:', userId);
//     const user = await User.findOne({ 
//       where: { id: userId },
//       logging: false // Disable SQL logging
//     });

//     if (user) {
//       console.log('✅ User found in deserialize:', user.id);
//       done(null, user);
//     } else {
//       console.warn('⚠️ User not found in deserialize for ID:', userId);
//       done(null, false);
//     }
    
//   } catch (error) {
//     console.error('❌ Error in deserializeUser:', error.message);
//     if (error.sql) {
//       console.error('🗄️ SQL:', error.sql);
//     }
//     if (error.original) {
//       console.error('🔍 Original error:', error.original.message || error.original);
//     }
    
//     // Don't pass the error to done() in deserialize as it can cause session issues
//     // Instead, just return null user
//     done(null, null);
//   }
// });

module.exports = passport;




