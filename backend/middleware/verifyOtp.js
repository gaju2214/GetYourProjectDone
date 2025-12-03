const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyOtpRequired = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if OTP is verified (only for non-local users or OTP users)
    // Allow if: otpVerified is true OR user uses local provider (email/password)
    if (user.provider !== 'local' && !user.otpVerified) {
      return res.status(403).json({ 
        error: 'OTP verification required',
        message: 'Please verify your phone number with OTP before proceeding'
      });
    }

    req.user = { userId: user.id, email: user.email };
    next();
  } catch (error) {
    console.error('OTP verification middleware error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyOtpRequired;
