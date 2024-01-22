const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Logged in successfully" });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
