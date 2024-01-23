const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_SECRET) {
    return res.json({ message: "Admin logged in successfully." });
  } else {
    return res.status(401).json({ message: "Invalid password." });
  }
});

router.get("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
