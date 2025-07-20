"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu"
import { Badge } from "./ui/Badge"
import { weatherAPI } from "../services/api"
import { Cloud, Search, User, MapPin, LogOut, Sun, Moon, Settings, Loader2 } from "lucide-react"

interface NavbarProps {
  onLocationSearch?: (location: string, lat?: number, lon?: number) => void
}

export function Navbar({ onLocationSearch }: NavbarProps) {
  const { user, logout, saveLocation } = useAuth()
  const { theme, toggleTheme, isAutoMode, setAutoMode } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<
    Array<{ name: string; country: string; lat: number; lon: number }>
  >([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchLocations = async () => {
      if (searchQuery.length >= 2) {
        console.log("Searching for:", searchQuery)
        setIsSearching(true)
        try {
          const response = await weatherAPI.searchLocation(searchQuery)
          console.log("Search response:", response.data)
          setSearchResults(response.data.results || [])
          setShowResults(true)
        } catch (error) {
          console.error("Search failed:", error)
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }

    const debounceTimer = setTimeout(searchLocations, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleLocationSelect = async (location: { name: string; lat: number; lon: number }) => {
    console.log("Location selected:", location)
    if (onLocationSearch) {
      onLocationSearch(location.name, location.lat, location.lon)
    }

    // Save location if user is logged in
    if (user) {
      await saveLocation(location)
    }

    setSearchQuery("")
    setShowResults(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && onLocationSearch) {
      onLocationSearch(searchQuery.trim())
      setSearchQuery("")
      setShowResults(false)
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">WeatherPro</span>
          </Link>

          <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for a city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                )}
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-y-auto">
                {searchResults.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 flex items-center space-x-3 first:rounded-t-xl last:rounded-b-xl"
                  >
                    <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{location.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{location.country}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {isAutoMode && (
              <Badge variant="secondary" className="text-xs">
                Auto
              </Badge>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <MapPin className="h-4 w-4 mr-2" />
                    Saved Locations ({user.savedLocations.length})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setAutoMode(!isAutoMode)}>
                    <Settings className="h-4 w-4 mr-2" />
                    {isAutoMode ? "Disable" : "Enable"} Auto Theme
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 dark:text-gray-300">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
