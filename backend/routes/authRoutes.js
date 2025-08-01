const authController = require('../controllers/authController');
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { User } = require('../models');
// Regular auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/auth/login`
   
  }),
  (req, res) => {
    try {
      console.log('Google callback - User:', req.user);
      
      // Check if user exists
      if (!req.user) {
        console.error('No user found in callback');
        return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
      }

      // Ensure user has an ID
      if (!req.user.id) {
        console.error(' User missing ID:', req.user);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=user_id_missing`);
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: req.user.id,
          email: req.user.email,
          provider: req.user.provider 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1m' }
      );

      console.log('JWT generated successfully for user:', req.user.id);

      // Redirect to frontend dashboard with token
    res.redirect(`${process.env.CLIENT_URL}/authsuccess?token=${token}`);
;
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=callback_error`);
    }
  }
);

module.exports = router;