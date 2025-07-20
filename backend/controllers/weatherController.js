const weatherService = require("../utils/weatherService")
const geocodingService = require("../utils/geocodingService")

// Get current weather by coordinates
const getCurrentWeather = async (req, res, next) => {
  try {
    const { lat, lon } = req.query

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude are required" })
    }

    // Convert string coordinates to numbers
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lon)

    // Reverse geocode to get location name
    const location = await geocodingService.reverseGeocode(latitude, longitude)
    
    // Get weather data
    const weatherData = await weatherService.getCurrentWeather(latitude, longitude, location)
    
    res.json(weatherData)
  } catch (error) {
    next(error)
  }
}

// Get weather forecast by coordinates
const getForecast = async (req, res, next) => {
  try {
    const { lat, lon } = req.query

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude are required" })
    }

    // Convert string coordinates to numbers
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lon)

    // Reverse geocode to get location name
    const location = await geocodingService.reverseGeocode(latitude, longitude)
    
    // Get forecast data
    const forecastData = await weatherService.getForecast(latitude, longitude, location)
    
    res.json(forecastData)
  } catch (error) {
    next(error)
  }
}

// Get weather data by location or coordinates (legacy POST route)
const getWeather = async (req, res, next) => {
  try {
    const { location, lat, lon } = req.body

    let weatherData
    let finalLocation = location

    if (lat && lon) {
      // Get weather by coordinates
      if (!location) {
        // Reverse geocode to get location name
        finalLocation = await geocodingService.reverseGeocode(lat, lon)
      }
      weatherData = await weatherService.getCurrentWeather(lat, lon, finalLocation)
    } else if (location) {
      // Get coordinates for location first
      const coords = await geocodingService.getCoordinates(location)
      weatherData = await weatherService.getCurrentWeather(coords.lat, coords.lon, location)
    } else {
      return res.status(400).json({ error: "Location or coordinates required" })
    }

    res.json(weatherData)
  } catch (error) {
    next(error)
  }
}

// Search locations
const searchLocations = async (req, res, next) => {
  try {
    const { q } = req.query // Changed from 'query' to 'q' to match frontend

    if (!q || q.length < 2) {
      return res.json({ results: [] })
    }

    const locations = await geocodingService.searchLocations(q)
    res.json({ results: locations })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCurrentWeather,
  getForecast,
  getWeather,
  searchLocations,
}
