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
    // Parse the URL to determine which weather endpoint to call
    const url = req.url || ''
    
    if (req.method === 'GET') {
      if (url.includes('/current') || req.query.city || (req.query.lat && req.query.lon)) {
        // Current weather endpoint
        if (req.query.lat && req.query.lon) {
          return await weatherController.getCurrentWeather(req, res)
        } else {
          return await weatherController.getWeather(req, res)
        }
      } else if (url.includes('/forecast')) {
        // Forecast endpoint
        return await weatherController.getForecast(req, res)
      } else {
        return res.status(400).json({ 
          error: "Weather endpoint not specified. Use /api/weather?city=London or /api/weather/forecast?city=London" 
        })
      }
    } else {
      res.status(405).json({ error: "Method not allowed" })
    }
  } catch (error) {
    console.error("Weather API error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
