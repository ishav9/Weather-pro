import { useEffect, useState } from "react"
import { Sun, Cloud, CloudRain, Zap, Snowflake, CloudSun, Eye } from "lucide-react"

interface WeatherAnimationProps {
  condition: string
  className?: string
}

export function WeatherAnimation({ condition, className = "" }: WeatherAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    if (condition === "rainy" || condition === "stormy" || condition === "snowy") {
      const particleCount = condition === "stormy" ? 30 : 25
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }))
      setParticles(newParticles)
    }
  }, [condition])

  const getWeatherIcon = () => {
    const iconClass = "h-12 w-12 drop-shadow-sm"

    switch (condition) {
      case "sunny":
        return <Sun className={`${iconClass} text-amber-500 animate-pulse`} style={{ animationDuration: "3s" }} />
      case "cloudy":
      case "overcast":
        return <Cloud className={`${iconClass} text-gray-500 dark:text-gray-400`} />
      case "partly-cloudy":
        return <CloudSun className={`${iconClass} text-amber-500`} />
      case "rainy":
        return <CloudRain className={`${iconClass} text-blue-600 dark:text-blue-400`} />
      case "stormy":
        return <Zap className={`${iconClass} text-purple-600 dark:text-purple-400 animate-pulse`} />
      case "snowy":
        return <Snowflake className={`${iconClass} text-blue-300 animate-spin`} style={{ animationDuration: "4s" }} />
      case "mist":
        return <Eye className={`${iconClass} text-gray-400 opacity-60`} />
      default:
        return <Sun className={`${iconClass} text-amber-500`} />
    }
  }

  const getBackgroundGradient = () => {
    switch (condition) {
      case "sunny":
        return "from-amber-50 via-orange-50 to-yellow-100 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20"
      case "cloudy":
      case "overcast":
        return "from-gray-100 via-slate-100 to-gray-200 dark:from-gray-800 dark:via-slate-800 dark:to-gray-700"
      case "partly-cloudy":
        return "from-blue-50 via-amber-50 to-orange-100 dark:from-blue-900/20 dark:via-amber-900/20 dark:to-orange-900/20"
      case "rainy":
        return "from-blue-100 via-slate-100 to-blue-200 dark:from-blue-900/30 dark:via-slate-800 dark:to-blue-800/30"
      case "stormy":
        return "from-purple-100 via-gray-200 to-slate-300 dark:from-purple-900/30 dark:via-gray-800 dark:to-slate-700"
      case "snowy":
        return "from-blue-50 via-slate-50 to-blue-100 dark:from-blue-900/20 dark:via-slate-800 dark:to-blue-800/20"
      case "mist":
        return "from-gray-50 via-slate-100 to-gray-100 dark:from-gray-800 dark:via-slate-700 dark:to-gray-700"
      default:
        return "from-blue-50 via-slate-50 to-blue-100 dark:from-blue-900/20 dark:via-slate-800 dark:to-blue-800/20"
    }
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${getBackgroundGradient()} ${className} rounded-xl`}>
      <div className="absolute inset-0 flex items-center justify-center">{getWeatherIcon()}</div>

      {/* Subtle animated particles */}
      {(condition === "rainy" || condition === "stormy" || condition === "snowy") && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute ${
                condition === "snowy"
                  ? "w-1 h-1 bg-white rounded-full"
                  : "w-0.5 h-3 bg-blue-400 dark:bg-blue-300 opacity-60"
              }`}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animation:
                  condition === "snowy"
                    ? `snowfall 4s linear infinite ${particle.delay}s`
                    : `rainfall 1.5s linear infinite ${particle.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Subtle lightning effect for stormy weather */}
      {condition === "stormy" && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-purple-200 dark:bg-purple-400 opacity-0"
            style={{
              animation: "lightning 4s infinite",
              animationDelay: "2s",
            }}
          />
        </div>
      )}

    </div>
  )
}
