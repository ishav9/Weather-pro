"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { WeatherAnimation } from "./WeatherAnimationNew"
import { Cloud, Droplets } from "lucide-react"

interface ForecastDay {
  date: string
  day: string
  high: number
  low: number
  condition: string
  icon: string
  precipitation: number
  windSpeed: number
  humidity: number
}

interface WeatherForecastProps {
  forecast: ForecastDay[]
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  const today = new Date().toISOString().split('T')[0]
  
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return '☀️'
      case 'partly-cloudy':
      case 'partly cloudy':
        return '⛅'
      case 'cloudy':
      case 'overcast':
        return '☁️'
      case 'rainy':
      case 'rain':
        return '🌧️'
      case 'stormy':
      case 'thunderstorm':
        return '⛈️'
      case 'snowy':
      case 'snow':
        return '❄'
      default:
        return '⛅'
    }
  }

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
          <Cloud className="h-5 w-5" />
          <span>7-Day Forecast</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          {forecast.slice(0, 7).map((day, index) => {
            const isToday = day.date === today
            return (
              <div
                key={day.date}
                className={`flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-md ${
                  isToday 
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700' 
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {/* Day and Date */}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {isToday ? 'Today' : day.day}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                {/* Weather Icon */}
                <div className="flex-shrink-0 mx-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    {index === 0 ? (
                      <WeatherAnimation condition={day.condition} className="w-10 h-10" />
                    ) : (
                      <span className="text-2xl">{getWeatherIcon(day.condition)}</span>
                    )}
                  </div>
                </div>

                {/* Temperature */}
                <div className="flex items-center space-x-3 flex-1 justify-end">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {day.high}°
                      </span>
                      <span className="text-base text-gray-500 dark:text-gray-400">
                        {day.low}°
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {day.condition.replace('-', ' ')}
                    </div>
                  </div>

                  {/* Precipitation */}
                  <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                    <Droplets className="h-3 w-3" />
                    <span className="text-xs font-medium">{day.precipitation}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
