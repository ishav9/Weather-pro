const express = require("express")
const { getCurrentWeather, getForecast, getWeather, searchLocations } = require("../controllers/weatherController")

const router = express.Router()

// GET /api/weather/current - Get current weather data by coordinates
router.get("/current", getCurrentWeather)

// GET /api/weather/forecast - Get weather forecast by coordinates
router.get("/forecast", getForecast)

// POST /api/weather - Get weather data (legacy route)
router.post("/", getWeather)

// GET /api/weather/search - Search locations
router.get("/search", searchLocations)

module.exports = router
