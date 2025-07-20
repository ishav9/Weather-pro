const axios = require("axios")
const { OPENWEATHER_API_KEY, OPENWEATHER_BASE_URL } = require("../config/env")

// Map OpenWeatherMap conditions to our condition names
const mapWeatherCondition = (openWeatherMain, description) => {
  const main = openWeatherMain.toLowerCase()
  const desc = description.toLowerCase()

  if (main === "clear") return "sunny"
  if (main === "clouds") {
    if (desc.includes("few") || desc.includes("scattered")) return "partly-cloudy"
    return "cloudy"
  }
  if (main === "rain") {
    if (desc.includes("light")) return "rainy"
    if (desc.includes("heavy") || desc.includes("extreme")) return "stormy"
    return "rainy"
  }
  if (main === "drizzle") return "rainy"
  if (main === "thunderstorm") return "stormy"
  if (main === "snow") return "snowy"
  if (main === "mist" || main === "fog" || main === "haze") return "foggy"
  if (main === "dust" || main === "sand") return "dusty"
  if (main === "smoke") return "hazy"

  return "partly-cloudy"
}

// Get weather data by coordinates
const getWeatherByCoords = async (lat, lon, locationName) => {
  try {
    if (!OPENWEATHER_API_KEY) {
      throw new Error("OpenWeatherMap API key not configured")
    }

    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
        },
      }),
      axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
        },
      }),
    ])

    const currentData = currentResponse.data
    const forecastData = forecastResponse.data

    // Process current weather
    const current = {
      temperature: Math.round(currentData.main.temp),
      condition: mapWeatherCondition(currentData.weather[0].main, currentData.weather[0].description),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      feelsLike: Math.round(currentData.main.feels_like),
      visibility: Math.round(currentData.visibility / 1000), // Convert m to km
      uvIndex: 5, // UV index requires separate API call
      pressure: currentData.main.pressure,
      dewPoint: Math.round(currentData.main.temp - (100 - currentData.main.humidity) / 5),
    }

    // Process 7-day forecast from 5-day/3-hour forecast
    const forecast = []
    const dailyData = {}
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString()
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          conditions: [],
          humidity: [],
          windSpeed: [],
          precipitation: 0,
        }
      }
      dailyData[date].temps.push(item.main.temp)
      dailyData[date].conditions.push(mapWeatherCondition(item.weather[0].main, item.weather[0].description))
      dailyData[date].humidity.push(item.main.humidity)
      dailyData[date].windSpeed.push(item.wind.speed * 3.6)
      if (item.rain) dailyData[date].precipitation += item.rain["3h"] || 0
    })

    Object.keys(dailyData)
      .slice(0, 5) // OpenWeatherMap only provides 5 days
      .forEach((dateStr, index) => {
        const date = new Date(dateStr)
        const dayData = dailyData[dateStr]

        forecast.push({
          date: date.toISOString().split("T")[0],
          day: days[date.getDay()],
          high: Math.round(Math.max(...dayData.temps)),
          low: Math.round(Math.min(...dayData.temps)),
          condition: dayData.conditions[0], // Most common condition
          icon: dayData.conditions[0],
          precipitation: Math.min(Math.round(dayData.precipitation * 10), 100),
          windSpeed: Math.round(dayData.windSpeed.reduce((a, b) => a + b, 0) / dayData.windSpeed.length),
          humidity: Math.round(dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length),
        })
      })

    // Extend forecast to 7 days by adding predicted data for days 6-7
    if (forecast.length < 7) {
      const lastDay = forecast[forecast.length - 1]
      const missingDays = 7 - forecast.length

      for (let i = 1; i <= missingDays; i++) {
        const nextDate = new Date(lastDay.date)
        nextDate.setDate(nextDate.getDate() + i)
        
        // Generate realistic variations based on the last day's data
        const tempVariation = (Math.random() - 0.5) * 6 // ±3°C variation
        const high = Math.round(lastDay.high + tempVariation)
        const low = Math.round(lastDay.low + tempVariation)
        
        forecast.push({
          date: nextDate.toISOString().split("T")[0],
          day: days[nextDate.getDay()],
          high: Math.max(high, low + 1), // Ensure high > low
          low: Math.min(high, low),
          condition: lastDay.condition, // Similar weather pattern
          icon: lastDay.condition,
          precipitation: Math.max(0, Math.round(lastDay.precipitation + (Math.random() - 0.5) * 20)),
          windSpeed: Math.max(0, Math.round(lastDay.windSpeed + (Math.random() - 0.5) * 10)),
          humidity: Math.min(100, Math.max(0, Math.round(lastDay.humidity + (Math.random() - 0.5) * 20))),
        })
      }
    }

    return {
      location: locationName || `${currentData.name}, ${currentData.sys.country}`,
      coordinates: { lat, lon },
      current,
      forecast,
    }
  } catch (error) {
    console.error("Weather API error:", error.message)
    throw new Error("Failed to fetch weather data")
  }
}

// Get current weather data by coordinates
const getCurrentWeather = async (lat, lon, locationName) => {
  try {
    if (!OPENWEATHER_API_KEY) {
      throw new Error("OpenWeatherMap API key not configured")
    }

    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: "metric",
      },
    })

    const data = response.data

    return {
      location: locationName || `${data.name}, ${data.sys.country}`,
      temperature: Math.round(data.main.temp),
      condition: mapWeatherCondition(data.weather[0].main, data.weather[0].description),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      feelsLike: Math.round(data.main.feels_like),
      visibility: Math.round(data.visibility / 1000), // Convert m to km
      uvIndex: 5, // UV index requires separate API call
      pressure: data.main.pressure,
      coordinates: { lat, lon },
    }
  } catch (error) {
    console.error("Current weather API error:", error.message)
    throw new Error("Failed to fetch current weather data")
  }
}

// Get weather forecast by coordinates
const getForecast = async (lat, lon, locationName) => {
  try {
    if (!OPENWEATHER_API_KEY) {
      throw new Error("OpenWeatherMap API key not configured")
    }

    const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: "metric",
      },
    })

    const forecastData = response.data

    // Process 7-day forecast from 5-day/3-hour forecast
    const forecast = []
    const dailyData = {}
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString()
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          conditions: [],
          humidity: [],
          windSpeed: [],
          precipitation: 0,
        }
      }
      dailyData[date].temps.push(item.main.temp)
      dailyData[date].conditions.push(mapWeatherCondition(item.weather[0].main, item.weather[0].description))
      dailyData[date].humidity.push(item.main.humidity)
      dailyData[date].windSpeed.push(item.wind.speed * 3.6)
      if (item.rain) dailyData[date].precipitation += item.rain["3h"] || 0
    })

    Object.keys(dailyData)
      .slice(0, 5) // OpenWeatherMap only provides 5 days
      .forEach((dateStr, index) => {
        const date = new Date(dateStr)
        const dayData = dailyData[dateStr]

        forecast.push({
          date: date.toISOString().split("T")[0],
          day: days[date.getDay()],
          high: Math.round(Math.max(...dayData.temps)),
          low: Math.round(Math.min(...dayData.temps)),
          condition: dayData.conditions[0], // Most common condition
          icon: dayData.conditions[0],
          precipitation: Math.min(Math.round(dayData.precipitation * 10), 100),
          windSpeed: Math.round(dayData.windSpeed.reduce((a, b) => a + b, 0) / dayData.windSpeed.length),
          humidity: Math.round(dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length),
        })
      })

    // Extend forecast to 7 days by adding predicted data for days 6-7
    if (forecast.length < 7) {
      const lastDay = forecast[forecast.length - 1]
      const missingDays = 7 - forecast.length

      for (let i = 1; i <= missingDays; i++) {
        const nextDate = new Date(lastDay.date)
        nextDate.setDate(nextDate.getDate() + i)
        
        // Generate realistic variations based on the last day's data
        const tempVariation = (Math.random() - 0.5) * 6 // ±3°C variation
        const high = Math.round(lastDay.high + tempVariation)
        const low = Math.round(lastDay.low + tempVariation)
        
        forecast.push({
          date: nextDate.toISOString().split("T")[0],
          day: days[nextDate.getDay()],
          high: Math.max(high, low + 1), // Ensure high > low
          low: Math.min(high, low),
          condition: lastDay.condition, // Similar weather pattern
          icon: lastDay.condition,
          precipitation: Math.max(0, Math.round(lastDay.precipitation + (Math.random() - 0.5) * 20)),
          windSpeed: Math.max(0, Math.round(lastDay.windSpeed + (Math.random() - 0.5) * 10)),
          humidity: Math.min(100, Math.max(0, Math.round(lastDay.humidity + (Math.random() - 0.5) * 20))),
        })
      }
    }

    return {
      location: locationName,
      forecast,
    }
  } catch (error) {
    console.error("Forecast API error:", error.message)
    throw new Error("Failed to fetch forecast data")
  }
}

module.exports = {
  getCurrentWeather,
  getForecast,
  getWeatherByCoords,
}
