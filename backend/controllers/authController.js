const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { JWT_SECRET, JWT_EXPIRE } = require("../config/env")

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE })
}

// Register user
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists with lean query for speed
    const existingUser = await User.findOne({ email }).lean()
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        savedLocations: user.savedLocations,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Check if user exists with lean query for speed
    const user = await User.findOne({ email }).lean()
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        savedLocations: user.savedLocations,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get current user
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")
    res.json({ user })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  getMe,
}
