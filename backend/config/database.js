const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/weatherapp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("❌ Database connection error:", error.message)
    console.log("⚠️  Running without database connection")
    // Don't exit in development mode to allow API testing
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }
}

module.exports = connectDB
