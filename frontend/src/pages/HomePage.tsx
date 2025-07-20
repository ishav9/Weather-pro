"use client"

import { useState, useEffect } from "react"
import { Navbar } from "../components/Navbar"
import { WeatherCard } from "../components/WeatherCardNew"
import { WeatherForecastCard } from "../components/WeatherForecastCard"
import { useGeolocation } from "../hooks/useGeolocation"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../components/ui/Toaster"
import { weatherAPI } from "../services/api"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { MapPin, Loader2, X } from "lucide-react"

export default function HomePage() {
    const { user, saveLocation, removeLocation } = useAuth()
  const { toast } = useToast()
  const { latitude, longitude, error: geoError, loading: geoLoading, requestLocation } = useGeolocation()
  const [currentWeather, setCurrentWeather] = useState<any>(null)
  const [forecast, setForecast] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isSavingLocation, setIsSavingLocation] = useState(false)

  useEffect(() => {
    console.log("Geolocation changed:", { latitude, longitude, geoError, geoLoading })
    if (latitude && longitude) {
      fetchWeatherData(latitude, longitude)
    }
  }, [latitude, longitude])

  const fetchWeatherData = async (lat: number, lon: number, locationName?: string) => {
    console.log("Fetching weather data for:", { lat, lon, locationName })
    setLoading(true)
    try {
      console.log("Making API calls...")
      const [weatherResponse, forecastResponse] = await Promise.all([
        weatherAPI.getCurrentWeather(lat, lon),
        weatherAPI.getForecast(lat, lon),
      ])

      console.log("API calls completed successfully")
      console.log("Weather response:", weatherResponse)
      console.log("Weather response.data:", weatherResponse.data)
      console.log("Forecast response:", forecastResponse)
      console.log("Forecast response.data:", forecastResponse.data)

      const weatherData = {
        ...weatherResponse.data,
        location: locationName || weatherResponse.data.location,
        // Ensure all required fields exist
        temperature: weatherResponse.data.temperature || 0,
        condition: weatherResponse.data.condition || 'partly-cloudy',
        description: weatherResponse.data.description || 'Partly cloudy',
        humidity: weatherResponse.data.humidity || 0,
        windSpeed: weatherResponse.data.windSpeed || 0,
        visibility: weatherResponse.data.visibility || 0,
        feelsLike: weatherResponse.data.feelsLike || 0,
      }
      console.log("Setting current weather:", weatherData)
      setCurrentWeather(weatherData)
      
      const forecastData = forecastResponse.data.forecast || []
      console.log("Setting forecast:", forecastData)
      setForecast(forecastData)
    } catch (error: any) {
      console.error("Failed to fetch weather data:", error)
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      })
      
      // Also log the full error object for debugging
      console.error("Full error object:", error)
      
      toast({
        title: "Error",
        description: `Failed to fetch weather data: ${error.response?.data?.error || error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLocationSearch = async (location: string, lat?: number, lon?: number) => {
    if (lat && lon) {
      fetchWeatherData(lat, lon, location)
    } else {
      // Search by name if coordinates not provided
      try {
        const searchResponse = await weatherAPI.searchLocation(location)
        const firstResult = searchResponse.data.results?.[0]
        if (firstResult) {
          fetchWeatherData(firstResult.lat, firstResult.lon, firstResult.name)
        }
      } catch (error) {
        console.error("Location search failed:", error)
        toast({
          title: "Error",
          description: "Location search failed",
          variant: "destructive",
        })
      }
    }
  }

  const handleSavedLocationClick = (location: any) => {
    fetchWeatherData(location.lat, location.lon, location.name)
  }

  const handleSaveLocation = async () => {
    if (!user || !currentWeather) {
      toast({
        title: "Error",
        description: "You must be logged in to save locations",
        variant: "destructive",
      })
      return
    }

    setIsSavingLocation(true)
    try {
      await saveLocation({
        name: currentWeather.location,
        lat: currentWeather.coordinates?.lat || latitude || 0,
        lon: currentWeather.coordinates?.lon || longitude || 0,
        country: currentWeather.location.split(', ')[1] || "",
      })

      toast({
        title: "Success",
        description: "Location saved successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to save location",
        variant: "destructive",
      })
    } finally {
      setIsSavingLocation(false)
    }
  }

  const isLocationSaved = () => {
    if (!user || !currentWeather) return false
    return user.savedLocations.some(
      (location) =>
        Math.abs(location.lat - (currentWeather.coordinates?.lat || latitude || 0)) < 0.01 &&
        Math.abs(location.lon - (currentWeather.coordinates?.lon || longitude || 0)) < 0.01
    )
  }

  const handleRemoveCurrentLocation = async () => {
    if (!user || !currentWeather) return
    
    // Find the saved location that matches the current weather
    const savedLocation = user.savedLocations.find(
      (location) =>
        Math.abs(location.lat - (currentWeather.coordinates?.lat || latitude || 0)) < 0.01 &&
        Math.abs(location.lon - (currentWeather.coordinates?.lon || longitude || 0)) < 0.01
    )
    
    if (savedLocation) {
      try {
        await removeLocation(savedLocation._id)
        toast({
          title: "Success",
          description: "Location removed from favorites!",
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to remove location",
          variant: "destructive",
        })
      }
    }
  }

  const handleRemoveLocation = async (locationId: string, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent triggering the location click
    
    try {
      await removeLocation(locationId)
      toast({
        title: "Success",
        description: "Location removed successfully!",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to remove location",
        variant: "destructive",
      })
    }
  }

  if (geoLoading || (loading && !currentWeather)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar onLocationSearch={handleLocationSearch} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              {geoLoading ? "Getting your location..." : "Loading weather data..."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Debug logging
  console.log("Rendering HomePage - currentWeather:", currentWeather)
  console.log("Rendering HomePage - forecast:", forecast)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onLocationSearch={handleLocationSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!geoError && !currentWeather && !geoLoading && (
          <Card className="mb-8 border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Welcome to WeatherPro
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Get real-time weather information for any location worldwide
                  </p>
                </div>
                <div className="space-y-4">
                  <Button 
                    onClick={requestLocation}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Use My Current Location
                  </Button>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Or use the search bar above to find weather for any city
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {geoError && !currentWeather && (
          <Card className="mb-8 border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Location Access Required
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {geoError}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={requestLocation}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                    <p className="text-sm text-blue-700 dark:text-blue-300 self-center">
                      Or search for a city in the search bar above
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Locations */}
        {user && user.savedLocations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Saved Locations</h2>
            <div className="flex flex-wrap gap-3">
              {user.savedLocations.map((location) => (
                <div key={location._id} className="relative group">
                  <Button
                    variant="outline"
                    onClick={() => handleSavedLocationClick(location)}
                    className="flex items-center space-x-2 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 pr-10"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{location.name}</span>
                  </Button>
                  <button
                    onClick={(e) => handleRemoveLocation(location._id, e)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove location"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Weather */}
        {currentWeather && (
          <WeatherCard 
            weather={currentWeather} 
            onSave={handleSaveLocation}
            onRemove={handleRemoveCurrentLocation}
            isSaved={isLocationSaved()}
            isSaving={isSavingLocation}
            showSaveButton={!!user}
          />
        )}

        {/* 7-Day Forecast */}
        {forecast.length > 0 && (
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">7-Day Forecast</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                {forecast.map((day, index) => (
                  <WeatherForecastCard
                    key={day.date}
                    day={day.date ? new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }) : "Today"}
                    date={day.date}
                    high={Math.round(day.high || 0)}
                    low={Math.round(day.low || 0)}
                    condition={day.condition}
                    precipitation={day.precipitation || 0}
                    windSpeed={day.windSpeed}
                    isToday={index === 0}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading overlay */}
        {loading && currentWeather && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-300">Updating weather...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
