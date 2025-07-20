const mongoose = require("mongoose")

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
    },
    timezone: {
      type: String,
      trim: true,
    },
    population: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
)

// Index for geospatial queries
locationSchema.index({ "coordinates.lat": 1, "coordinates.lon": 1 })
locationSchema.index({ name: "text", country: "text" })

module.exports = mongoose.model("Location", locationSchema)
