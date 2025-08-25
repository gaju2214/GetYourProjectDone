const authController = require("../controllers/authController");
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const authenticateUser = require("../middleware/auth"); // Import your middleware

// Regular auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

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
        return res.redirect(
          `${process.env.CLIENT_URL}/auth/login?error=auth_failed`
        );
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 3600000, // 1 hour
      });

      res.redirect(`${process.env.CLIENT_URL}/profile`);
    } catch (error) {
      console.error("Error during Google callback:", error);
      res.redirect(`${process.env.CLIENT_URL}/auth/login?error=callback_error`);
    }
  }
);

router.get("/profile", authenticateUser, async (req, res) => {
  console.log("📩 Profile route hit");
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

router.put("/profile", authenticateUser, async (req, res) => {
  try {
    // req.user is available from the middleware
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
    } = req.body;

    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (city) user.city = city;
    if (pincode) user.pincode = pincode;
    if (state) user.state = state;
    if (country) user.country = country;
    if (name) user.name = name;
    if (lastname) user.lastname = lastname;
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
module.exports = router;
