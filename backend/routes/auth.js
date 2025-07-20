const express = require("express")
const { register, login, getMe } = require("../controllers/authController")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// POST /api/auth/register
router.post("/register", register)

// POST /api/auth/login
router.post("/login", login)

// GET /api/auth/me
router.get("/me", authMiddleware, getMe)

module.exports = router
