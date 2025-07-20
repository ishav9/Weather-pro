const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message)
  console.error("Stack:", err.stack)

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ error: "Duplicate field value" })
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message)
    return res.status(400).json({ error: errors.join(", ") })
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" })
  }

  // Default error
  res.status(err.statusCode || 500).json({
    error: err.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

module.exports = errorHandler
