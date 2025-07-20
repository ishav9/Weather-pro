const mongoose = require("mongoose")
const app = require('../app')
require("dotenv").config()

// Connect to MongoDB for serverless function
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/weatherapp")
  .then(() => {
    console.log("📦 Connected to MongoDB")
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error)
  })

// Export the Express app for Vercel
module.exports = app
