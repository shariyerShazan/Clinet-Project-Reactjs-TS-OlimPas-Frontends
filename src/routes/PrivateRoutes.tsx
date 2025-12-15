
import type React from "react"
import { Navigate } from "react-router"
import { toast } from "react-toastify"
import { useAuth } from "@/(dashboard)/auth/AuthContext"

// Utility to read a cookie by name
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const accessToken = getCookie("access_token")

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    )
  }

  if (!user || !accessToken) {
    toast.warning("You must be logged in to access the dashboard")
    return <Navigate to="/dashboard/login" replace />
  }

  return <>{children}</>
}