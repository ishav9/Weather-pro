"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authAPI, userAPI } from "../services/api"

interface SavedLocation {
  _id: string
  name: string
  lat: number
  lon: number
  country?: string
  savedAt: string
}

interface User {
  id: string
  email: string
  name: string
  savedLocations: SavedLocation[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  saveLocation: (location: { name: string; lat: number; lon: number; country?: string }) => Promise<void>
  removeLocation: (locationId: string) => Promise<void>
  loadSavedLocations: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem("token")
    if (token) {
      fetchUserProfile()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile()
      setUser(response.data.user)
      
      // Load saved locations after profile fetch
      setTimeout(() => loadSavedLocations(), 100)
    } catch (error) {
      localStorage.removeItem("token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await authAPI.login(email, password)
      const { token, user } = response.data

      localStorage.setItem("token", token)
      setUser(user)
      
      // Load saved locations after login
      setTimeout(() => loadSavedLocations(), 100)
      
      return true
    } catch (error) {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await authAPI.register(name, email, password)
      const { token, user } = response.data

      localStorage.setItem("token", token)
      setUser(user)
      
      // Load saved locations after signup
      setTimeout(() => loadSavedLocations(), 100)
      
      return true
    } catch (error) {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
  }

  const saveLocation = async (location: { name: string; lat: number; lon: number; country?: string }) => {
    if (!user) return

    try {
      const response = await userAPI.saveLocation(location)
      setUser((prev) =>
        prev
          ? {
              ...prev,
              savedLocations: response.data.savedLocations,
            }
          : null,
      )
    } catch (error) {
      console.error("Failed to save location:", error)
      throw error
    }
  }

  const removeLocation = async (locationId: string) => {
    if (!user) return

    try {
      const response = await userAPI.removeLocation(locationId)
      setUser((prev) =>
        prev
          ? {
              ...prev,
              savedLocations: response.data.savedLocations,
            }
          : null,
      )
    } catch (error) {
      console.error("Failed to remove location:", error)
      throw error
    }
  }

  const loadSavedLocations = async () => {
    if (!user) return

    try {
      const response = await userAPI.getSavedLocations()
      setUser((prev) =>
        prev
          ? {
              ...prev,
              savedLocations: response.data.savedLocations || [],
            }
          : null,
      )
    } catch (error) {
      console.error("Failed to load saved locations:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        saveLocation,
        removeLocation,
        loadSavedLocations,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
