const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({
    user: { id: req.user.id, email: req.user.email },
  });
});

// Check authentication status
router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: { id: req.user.id, email: req.user.email }
    });
  } else {
    res.json({ isAuthenticated: false, user: null });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: "Error during logout" });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ message: "Error destroying session" });
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;
