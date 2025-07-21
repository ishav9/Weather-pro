const mongoose = require("mongoose")
const weatherController = require("../backend/controllers/weatherController")
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
    if (req.method === 'GET') {
      return await weatherController.getForecast(req, res)
    } else {
      res.status(405).json({ error: "Method not allowed" })
    }
  } catch (error) {
    console.error("Forecast API error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
