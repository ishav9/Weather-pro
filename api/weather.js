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
      if (req.query.city) {
        return await weatherController.getCurrentWeather(req, res)
      } else if (req.query.lat && req.query.lon) {
        return await weatherController.getCurrentWeatherByCoords(req, res)
      } else {
        return res.status(400).json({ error: "City name or coordinates (lat, lon) required" })
      }
    } else {
      res.status(405).json({ error: "Method not allowed" })
    }
  } catch (error) {
    console.error("Weather API error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
