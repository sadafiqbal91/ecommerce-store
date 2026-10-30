const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { protect } = require("../middleware/auth");

const router = express.Router();

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

const userData = (u, token) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  token,
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email" });
    }
    if (password.length < 6 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return res.status(400).json({
        message: "Password must be 6+ characters with at least one letter and one number",
      });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const count = await User.countDocuments();
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: count === 0 ? "admin" : "user",
    });
    res.status(201).json(userData(user, makeToken(user._id)));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    res.json(userData(user, makeToken(user._id)));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/me", protect, (req, res) => res.json(req.user));

module.exports = router;
