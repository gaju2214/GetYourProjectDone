const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendOTP } = require('../utils/sendOtp');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Check if user exists and what auth methods are available
exports.checkUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber.toString().trim())) {
      return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
    }

    const cleanPhone = phoneNumber.toString().trim();
    const user = await User.findOne({ where: { phoneNumber: cleanPhone } });

    if (!user) {
      // New user
      return res.status(200).json({
        isNewUser: true,
        message: 'New user - please register',
      });
    }

    // Existing user - determine available auth methods
    const availableAuth = [];
    if (user.password && user.password.trim() !== '') {
      availableAuth.push('password');
    }
    availableAuth.push('otp');

    res.status(200).json({
      isNewUser: false,
      userId: user.id,
      availableAuth,
      message: 'User found',
    });
  } catch (error) {
    console.error('Check user error:', error);
    res.status(500).json({ error: 'Failed to check user' });
  }
};

// Login with phone number and password
exports.loginWithPhonePassword = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ error: 'Phone number and password are required' });
    }

    const cleanPhone = phoneNumber.toString().trim();
    const user = await User.findOne({ where: { phoneNumber: cleanPhone } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.password) {
      return res.status(400).json({ error: 'This account does not have a password set' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login with phone password error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

exports.register = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: 'Missing request body' });
  }
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'Registered successfully', userId: user.id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Send OTP to phone number
exports.sendOtp = async (req, res) => {
  try {
    const { phoneNumber, name } = req.body;

    console.log(`\n📝 Send OTP Request:`);
    console.log(`   Name: ${name || '<none>'}`);
    console.log(`   Phone: ${phoneNumber}`);
    console.log(`   Phone Length: ${phoneNumber?.length}`);

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Trim and validate phone number
    const cleanPhone = phoneNumber.toString().trim();
    
    if (!/^\d{10}$/.test(cleanPhone)) {
      console.error(`❌ Invalid phone format: "${cleanPhone}" (length: ${cleanPhone.length})`);
      return res.status(400).json({ 
        error: 'Invalid phone number format. Must be exactly 10 digits.',
        received: cleanPhone,
        length: cleanPhone.length
      });
    }

    console.log(`✅ Phone validation passed: ${cleanPhone}`);

    // Generate OTP
    const otp = generateOTP();
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Check if user exists
    let user = await User.findOne({ where: { phoneNumber: cleanPhone } });

    if (!user) {
      // Create new user with OTP (name optional)
      console.log(`👤 Creating new user with phone: ${cleanPhone}`);
      user = await User.create({
        phoneNumber: cleanPhone,
        name: name || null,
        email: `${cleanPhone}@temp.local`, // Temporary email for non-Google users
        otpCode: otp,
        otpExpiryTime: expiryTime,
        otpVerified: false,
        provider: 'otp',
      });
    } else {
      // Update existing user with new OTP
      console.log(`👤 Updating existing user with phone: ${cleanPhone}`);
      user.otpCode = otp;
      user.otpExpiryTime = expiryTime;
      user.otpVerified = false;
      await user.save();
    }

    console.log(`🔐 Generated OTP: ${otp} (expires in 5 minutes)`);

    // Send OTP via SMS
    await sendOTP(cleanPhone, otp);

    res.status(200).json({
      message: 'OTP sent successfully',
      userId: user.id,
      phoneNumber: cleanPhone,
    });
  } catch (error) {
    console.error('❌ Send OTP error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to send OTP' });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ error: 'User ID and OTP are required' });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if OTP has expired
    if (new Date() > user.otpExpiryTime) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    // Check if OTP is correct
    if (user.otpCode !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Mark OTP as verified
    user.otpVerified = true;
    user.otpCode = null; // Clear OTP
    user.otpExpiryTime = null;

    // If email was temporary, generate a proper one
    if (user.email.includes('@temp.local')) {
      user.email = `${user.phoneNumber}${Date.now()}@getyourprojectdone.local`;
    }

    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
        otpVerified: user.otpVerified,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.userId || req.body.userId;

    // Validate input
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Find user
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If user already has a password, verify the current password
    if (user.password && user.password.trim() !== '') {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required' });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
    }
    // If user doesn't have a password, it's a new user setting password for the first time

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password updated successfully',
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};
