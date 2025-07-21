const mongoose = require("mongoose")
const authController = require("../backend/controllers/authController")
require("dotenv").config()

// Connect to MongoDB for serverless function (with connection pooling)
if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/weatherapp")
    .then(() => {
      console.log("📦 Connected to MongoDB")
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error)
    })
}

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      if (req.url === '/api/auth/login' || req.url.endsWith('/login')) {
        return await authController.login(req, res)
      } else if (req.url === '/api/auth/register' || req.url.endsWith('/register')) {
        return await authController.register(req, res)
      } else {
        return res.status(404).json({ error: "Auth endpoint not found" })
      }
    } else {
      res.status(405).json({ error: "Method not allowed" })
    }
  } catch (error) {
    console.error("Auth API error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
