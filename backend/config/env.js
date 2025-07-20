require("dotenv").config()

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  // Database
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/weatherapp",

  // Weather API
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  OPENWEATHER_BASE_URL: "https://api.openweathermap.org/data/2.5",
  OPENWEATHER_GEO_URL: "https://api.openweathermap.org/geo/1.0",

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",

  // Rate Limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100, // requests per window
}
