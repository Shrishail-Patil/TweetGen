"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Cookies from "js-cookie"
import { useState } from "react"

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) throw new Error('Error signing out: ' + error.message)

      // Clear all cookies
      const allCookies = Cookies.get()
      Object.keys(allCookies).forEach(cookieName => {
        Cookies.remove(cookieName)
      })

      // Clear user info from state
      // setUserInfo(null)

      // Force a hard reload to clear cached session
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <Button onClick={handleLogout} variant="destructive" size="sm" className="gap-2" disabled={isLoggingOut}>
      <LogOut className="h-4 w-4" />
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  )
}