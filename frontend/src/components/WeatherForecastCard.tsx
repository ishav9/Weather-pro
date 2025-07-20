import { Card, CardContent } from "./ui/Card"
import { WeatherAnimation } from "./WeatherAnimationNew"
import { Droplets, Wind } from "lucide-react"

interface WeatherForecastCardProps {
  day: string
  date: string
  high: number
  low: number
  condition: string
  precipitation: number
  windSpeed?: number
  humidity?: number
  isToday?: boolean
}

export function WeatherForecastCard({
  day,
  date,
  high,
  low,
  condition,
  precipitation,
  windSpeed,
  isToday = false,
}: WeatherForecastCardProps) {
  return (
    <Card
      className={`transition-all duration-300 hover:scale-105 hover:shadow-lg border-0 shadow-md bg-white dark:bg-gray-800 ${
        isToday ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div>
            <p
              className={`font-medium ${
                isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"
              }`}
            >
              {isToday ? "Today" : day}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>

          <WeatherAnimation condition={condition} className="h-16 w-full" />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{high}°</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{low}°</span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 capitalize font-medium">
              {condition.replace("-", " ")}
            </p>

            <div className="flex items-center justify-center space-x-3 text-xs">
              <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                <Droplets className="h-3 w-3" />
                <span>{precipitation}%</span>
              </div>
              {windSpeed && (
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <Wind className="h-3 w-3" />
                  <span>{windSpeed}km/h</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
