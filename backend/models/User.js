const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    savedLocations: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        lat: {
          type: Number,
          required: true,
        },
        lon: {
          type: Number,
          required: true,
        },
        country: {
          type: String,
          trim: true,
        },
        savedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    preferences: {
      temperatureUnit: {
        type: String,
        enum: ["celsius", "fahrenheit"],
        default: "celsius",
      },
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "auto",
      },
    },
  },
  {
    timestamps: true,
  },
)

// Index for faster queries
userSchema.index({ email: 1 })

module.exports = mongoose.model("User", userSchema)
