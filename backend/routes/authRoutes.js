const authController = require("../controllers/authController");
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User, UserInfo } = require("../models");
const bcrypt = require("bcrypt");
const authenticateUser = require("../middleware/auth"); // Import your middleware

// Regular auth routes (public - no auth required)
router.post("/register", authController.register);
router.post("/login", authController.login);
// Phone-first helpers
router.post("/check-user", authController.checkUser);
router.post("/login-phone-password", authController.loginWithPhonePassword);

// OTP routes (public - no auth required for first-time signup/login)
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);

// Password update route (requires authentication)
router.post("/update-password", authenticateUser, authController.updatePassword);

// Test SMS endpoint (for debugging)
router.post("/test-sms", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const { sendOTP } = require('../utils/sendOtp');
    const testOtp = '123456';
    const result = await sendOTP(phoneNumber, testOtp);

    res.status(200).json({
      message: 'Test SMS sent',
      phoneNumber,
      otp: testOtp,
      result
    });
  } catch (error) {
    console.error('Test SMS error:', error);
    res.status(500).json({ error: error.message });
  }
});

// // Google OAuth routes
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: `${process.env.CLIENT_URL}/auth/login`,
//   }),
//   (req, res) => {
//     try {
//       const user = req.user;

//       if (!user || !user.id) {
//         return res.redirect(
//           `${process.env.CLIENT_URL}/auth/login?error=auth_failed`
//         );
//       }

//       const token = jwt.sign(
//         {
//           userId: user.id,
//           email: user.email,
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: "1h" }
//       );

//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "Lax",
//         maxAge: 3600000, // 1 hour
//       });

//       res.redirect(`${process.env.CLIENT_URL}/account`);
//     } catch (error) {
//       console.error("Error during Google callback:", error);
//       res.redirect(`${process.env.CLIENT_URL}/auth/login?error=callback_error`);
//     }
//   }
// );

// Google OAuth entry
router.get("/google", (req, res, next) => {
  const returnUrl = req.query.returnUrl;

  if (returnUrl) {
    res.cookie("returnUrl", returnUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 5 * 60 * 1000, // 5 minutes
    });
  }

  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth/login`,
  }),
  (req, res) => {
    try {
      const user = req.user;

      if (!user || !user.id) {
        return res.redirect(`${process.env.CLIENT_URL}/auth/login?error=auth_failed`);
      }

      // Check if user has name and phone number
      if (!user.phoneNumber) {
        // Redirect to OTP verification page with user ID
        return res.redirect(
          `${process.env.CLIENT_URL}/auth/otp?userId=${user.id}&email=${user.email}&name=${user.name}`
        );
      }

      // Generate OTP for verification
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Save OTP to user
      user.otpCode = otp;
      user.otpExpiryTime = expiryTime;
      user.save().catch(err => console.error('Error saving OTP:', err));

      // Send OTP via SMS
      if (user.phoneNumber) {
        const { sendOTP } = require('../utils/sendOtp');
        sendOTP(user.phoneNumber, otp).catch(err => 
          console.error('Error sending OTP:', err)
        );
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Get returnUrl from cookie (if set)
      const redirectUrl = req.cookies.returnUrl;
      res.clearCookie("returnUrl");

      // Validate returnUrl
      const isValidReturnUrl = (url) => {
        if (!url) return false;
        try {
          const parsedUrl = new URL(url);
          const clientUrl = new URL(process.env.CLIENT_URL);
          return parsedUrl.hostname === clientUrl.hostname;
        } catch {
          return false;
        }
      };

      if (isValidReturnUrl(redirectUrl)) {
        console.log(`✅ Redirecting to stored URL: ${redirectUrl}`);
        res.redirect(redirectUrl);
      } else {
        console.log("⚠️ No valid returnUrl, redirecting to /account");
        res.redirect(`${process.env.CLIENT_URL}/account`);
      }
    } catch (error) {
      console.error("Error during Google callback:", error);
      res.redirect(`${process.env.CLIENT_URL}/auth/login?error=callback_error`);
    }
  }
);

router.get("/profile", authenticateUser, async (req, res) => {
  // console.log("📩 Profile route hit");
  try {
    // req.user is available from the middleware
    const user = await User.findOne({ where: { id: req.user.userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
      dob: user.dob,        
      gender: user.gender,  
      avatar: user.avatar,
      provider: user.provider,
      address: user.address,
      city: user.city,
      pincode: user.pincode,
      state: user.state,
      country: "India",
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});
// Update profile
router.put("/profile", authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const {
      phoneNumber,
      password,
      name,
      lastname,
      address,
      city,
      pincode,
      state,
      country,
      dob,
      gender,
    } = req.body;

    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (city) user.city = city;
    if (pincode) user.pincode = pincode;
    if (state) user.state = state;
    if (country) user.country = country;
    if (name) user.name = name;
    if (lastname) user.lastname = lastname;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
        gender: user.gender,
        avatar: user.avatar,
        provider: user.provider,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        state: user.state,
        country: user.country,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


router.post("/logout", (req, res) => {
  try {
    req.logout(() => {
      req.session?.destroy?.();
      res.clearCookie("token");
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Logout failed" });
  }
});

// router.get('/checkAuth', authenticateUser, (req, res) => {
//   res.status(200).json({
//     success: true,
//     status:200,
//     message: 'authenticated',
//     user: req.user, // contains userId, email, etc. from decoded JWT
//   });
// });

// router.post('/getproject', authenticateUser, async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     console.log(`🔐 Access granted to user: ${userId}`);

//     res.status(200).json({
//       message: `Welcome to the project page, user ${userId}`,
//       userId,
//       access: 'granted',
//     });
//   } catch (error) {
//     console.error('Error in project route:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



router.post("/userinfo", async (req, res) => {
  try {
    const { name, phoneNumber, projectId } = req.body;

    // validation (optional, extra safety)
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newUserInfo = await UserInfo.create({
      name,
      phoneNumber,
      projectId
    });

    res.status(201).json(newUserInfo);
  } catch (error) {
    console.error("Error creating user info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get all users (Admin route)
// IMPORTANT: Put search route BEFORE the :id route
router.get("/users/public", async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search = '' 
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Build search conditions
    const { Op } = require('sequelize');
    const whereCondition = search ? {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { lastname: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phoneNumber: { [Op.iLike]: `%${search}%` } } // Added phone search
      ]
    } : {};

    const { count, rows: users } = await User.findAndCountAll({
      where: whereCondition,
      attributes: [
        'id', 'name', 'lastname', 'email', 'phoneNumber', 'city', 'state', 'createdAt'
        // Removed sensitive fields like phone, address, dob
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalUsers: count,
        hasNextPage: page * limit < count,
        hasPrevPage: page > 1
      },
      users: users
    });

  } catch (error) {
    console.error("Get public users error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch users" 
    });
  }
});


module.exports = router;
