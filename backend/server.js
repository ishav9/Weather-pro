const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const weatherRoutes = require("./routes/weather")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const errorHandler = require("./middleware/errorHandler")

const app = express()

// Connect to MongoDB with optimized settings
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/weatherapp", {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0, // Disable mongoose buffering
  })
  .then(() => {
    console.log("📦 Connected to MongoDB")
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message)
    console.log("⚠️  Running without database connection")
  })

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}))

// CORS configuration - Allow specific origins
app.use(
  cors({
    origin: [
      "https://weather-pro-theta-six.vercel.app", // Your frontend URL
      "http://localhost:5173", // Vite dev server for local development
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true, // Can be true now with specific origins
  })
)

// Remove conflicting CORS headers - handled by cors() middleware above

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/weather", weatherRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)

// Root route - API info
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Weather App Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      weather: "/api/weather/current?city=London",
      forecast: "/api/weather/forecast?city=London", 
      auth: {
        login: "/api/auth/login (POST)",
        register: "/api/auth/register (POST)"
      }
    },
    status: "running",
    timestamp: new Date().toISOString()
  })
})

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    apiKey: process.env.OPENWEATHER_API_KEY ? "configured" : "missing"
  })
})

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Start server (only in non-Vercel environments)
const PORT = process.env.PORT || 5001

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`🌤️  Weather API running on port ${PORT}`)
    console.log(`🔗 API available at: http://localhost:${PORT}`)
    console.log(`🏥 Health check: http://localhost:${PORT}/health`)
    console.log(`🔑 API Key: ${process.env.OPENWEATHER_API_KEY ? 'configured' : 'MISSING!'}`)
  })

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use`)
      process.exit(1)
    } else {
      console.error('❌ Server error:', error)
    }
  })

  // Graceful shutdown
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close()
      console.log("📦 MongoDB connection closed")
      process.exit(0)
    } catch (error) {
      console.error("Error during shutdown:", error)
      process.exit(1)
    }
  })
}

// Export the app for Vercel
module.exports = app
