"use client"

import React from "react"
import { Card, CardContent } from "./ui/Card"
import { Button } from "./ui/Button"
import { WeatherAnimation } from "./WeatherAnimationNew"
import { MapPin, Droplets, Wind, Eye, Sun, Heart, HeartOff } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  visibility: number
  uvIndex?: number
  feelsLike: number
}

interface WeatherCardProps {
  weather: WeatherData
  onSave?: () => void
  onRemove?: () => void
  isSaved?: boolean
  isSaving?: boolean
  showSaveButton?: boolean
}

export function WeatherCard({ 
  weather, 
  onSave, 
  onRemove, 
  isSaved = false, 
  isSaving = false,
  showSaveButton = false 
}: WeatherCardProps) {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isSaved && onRemove) {
      onRemove()
    } else if (!isSaved && onSave) {
      onSave()
    }
  }

  return (
    <Card className="mb-8 overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800">
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{weather.location}</h1>
              </div>
              {showSaveButton && (
                <Button
                  onClick={handleSaveClick}
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20 bg-transparent"
                >
                  {isSaved ? <HeartOff className="h-4 w-4 mr-1" /> : <Heart className="h-4 w-4 mr-1" />}
                  {isSaved ? "Remove" : "Save"}
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-5xl font-light text-gray-900 dark:text-white mb-2">
                  {weather.temperature}°C
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 capitalize">
                  {weather.condition.replace('-', ' ')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Feels like {weather.feelsLike}°C
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
                    <p className="font-medium text-gray-900 dark:text-white">{weather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Wind className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {weather.windSpeed} km/h
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Visibility</p>
                    <p className="font-medium text-gray-900 dark:text-white">{weather.visibility} km</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Sun className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">UV Index</p>
                    <p className="font-medium text-gray-900 dark:text-white">{weather.uvIndex || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <WeatherAnimation condition={weather.condition} className="h-full min-h-[400px]" />
        </div>
      </CardContent>
    </Card>
  )
}
