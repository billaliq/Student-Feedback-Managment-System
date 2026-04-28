const express = require("express");
const router = express.Router();

// POST /auth/login - Mock admin login
router.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (username === adminUsername && password === adminPassword) {
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: "mock-admin-token-" + Date.now(),
      user: { username: adminUsername, role: "admin" },
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password",
  });
});

module.exports = router;
