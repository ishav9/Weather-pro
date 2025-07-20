const User = require("../models/User")

// Save location
const saveLocation = async (req, res, next) => {
  try {
    const { name, lat, lon, country } = req.body
    const userId = req.user.userId

    // Validate required fields
    if (!name || !lat || !lon) {
      return res.status(400).json({ error: "Name, latitude, and longitude are required" })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Check if location already saved (by coordinates)
    const existingLocation = user.savedLocations.find(
      (loc) => Math.abs(loc.lat - lat) < 0.01 && Math.abs(loc.lon - lon) < 0.01
    )

    if (existingLocation) {
      return res.status(409).json({ error: "Location already saved" })
    }

    // Add new location
    const newLocation = {
      name: name.trim(),
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country: country?.trim() || "",
      savedAt: new Date(),
    }

    user.savedLocations.push(newLocation)
    await user.save()

    res.json({
      success: true,
      message: "Location saved successfully",
      savedLocations: user.savedLocations,
    })
  } catch (error) {
    next(error)
  }
}

// Remove location
const removeLocation = async (req, res, next) => {
  try {
    const { locationId } = req.params
    const userId = req.user.userId

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Remove location by ID
    const initialLength = user.savedLocations.length
    user.savedLocations = user.savedLocations.filter(
      (loc) => loc._id.toString() !== locationId
    )

    if (user.savedLocations.length === initialLength) {
      return res.status(404).json({ error: "Location not found" })
    }

    await user.save()

    res.json({
      success: true,
      message: "Location removed successfully",
      savedLocations: user.savedLocations,
    })
  } catch (error) {
    next(error)
  }
}

// Get saved locations
const getSavedLocations = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const user = await User.findById(userId).select("savedLocations")

    res.json({
      savedLocations: user.savedLocations || [],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  saveLocation,
  removeLocation,
  getSavedLocations,
}
