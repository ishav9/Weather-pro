const axios = require("axios")
const { OPENWEATHER_API_KEY, OPENWEATHER_GEO_URL } = require("../config/env")

// Search locations by query
const searchLocations = async (query) => {
  try {
    if (!OPENWEATHER_API_KEY) {
      throw new Error("OpenWeatherMap API key not configured")
    }

    const response = await axios.get(`${OPENWEATHER_GEO_URL}/direct`, {
      params: {
        q: query,
        limit: 8,
        appid: OPENWEATHER_API_KEY,
      },
    })

    return response.data.map((location) => ({
      name: `${location.name}, ${location.country}`,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
    }))
  } catch (error) {
    console.error("Geocoding API error:", error.message)
    throw new Error("Failed to search locations")
  }
}

// Get coordinates for a location
const getCoordinates = async (locationName) => {
  try {
    if (!OPENWEATHER_API_KEY) {
      throw new Error("OpenWeatherMap API key not configured")
    }

    const response = await axios.get(`${OPENWEATHER_GEO_URL}/direct`, {
      params: {
        q: locationName,
        limit: 1,
        appid: OPENWEATHER_API_KEY,
      },
    })

    if (response.data.length === 0) {
      throw new Error("Location not found")
    }

    const location = response.data[0]
    return {
      lat: location.lat,
      lon: location.lon,
      name: `${location.name}, ${location.country}`,
    }
  } catch (error) {
    console.error("Geocoding API error:", error.message)
    throw new Error("Failed to get coordinates")
  }
}

// Reverse geocode coordinates to location name
const reverseGeocode = async (lat, lon) => {
  try {
    if (!OPENWEATHER_API_KEY) {
      throw new Error("OpenWeatherMap API key not configured")
    }

    const response = await axios.get(`${OPENWEATHER_GEO_URL}/reverse`, {
      params: {
        lat,
        lon,
        limit: 1,
        appid: OPENWEATHER_API_KEY,
      },
    })

    if (response.data.length === 0) {
      return "Unknown Location"
    }

    const location = response.data[0]
    return `${location.name}, ${location.country}`
  } catch (error) {
    console.error("Reverse geocoding API error:", error.message)
    return "Unknown Location"
  }
}

module.exports = {
  searchLocations,
  getCoordinates,
  reverseGeocode,
}
