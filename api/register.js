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
      return await authController.register(req, res)
    } else {
      res.status(405).json({ error: "Method not allowed. Use POST for registration." })
    }
  } catch (error) {
    console.error("Register API error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
