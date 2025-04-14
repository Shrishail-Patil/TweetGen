"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase/supabaseClient"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, Moon, Sun, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FloatingElements from "../../components/FloatingElements"
import TweetGenerator from "../../components/TweetGenerator"
import RandomTweetGenerator from "../../components/RandomTweetGenerator"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import SupportButton from "../../components/SupportButton"
import LogoutButton from "../../components/LogoutButton"
import UserProfile from "../../components/UserProfile"
import Bookmarks from "@/app/components/Bookmarks"
import FeedbackButton from "@/app/components/FeedbackDialogue"

// Updated to enforce type compatibility properly

export default function Page() {
  const [isDark, setIsDark] = useState(false)
  const [sessionUser, setSessionUser] = useState<{ email: string; name?: string } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        console.error("[DASHBOARD] Error fetching user:", error?.message)
        router.replace("/login")
      } else {
        // setUser(data.user as any);
        setSessionUser({
          email: data.user.email as string,
          name: data.user.user_metadata?.full_name || data.user.user_metadata?.name,
        })
      }
    }

    fetchUser()
  }, [router])

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!sessionUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading user information...</p>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${isDark ? "dark" : ""}`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="relative min-h-screen bg-background text-foreground">
        <Analytics />
        <SpeedInsights />
        <FloatingElements />

        {/* Mobile Menu Toggle Button */}
        <div className="fixed top-4 right-4 z-50 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full hover:bg-muted"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="fixed top-0 right-0 p-4 z-40 hidden md:flex items-center gap-2">
          <FeedbackButton />
          <Bookmarks />
          <SupportButton />
          <UserProfile user={sessionUser} />
          <LogoutButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full hover:bg-muted"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </nav>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden"
            >
              <div className="flex flex-col items-center justify-center h-full gap-6 p-4">
                <FeedbackButton />
                <Bookmarks />
                <SupportButton />
                <UserProfile user={sessionUser} />
                <LogoutButton />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDark(!isDark)}
                  className="rounded-full hover:bg-muted"
                >
                  {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="container max-w-5xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold tracking-tight mb-4">Tweet Geni</h1>
            <p className="text-muted-foreground text-lg">Generate engaging tweets for your content</p>
          </motion.div>

          <Tabs defaultValue="saas" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
              <TabsTrigger value="saas">SaaS Tweets</TabsTrigger>
              <TabsTrigger value="random">Random Tweets</TabsTrigger>
            </TabsList>
            <TabsContent value="saas" className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">SaaS Tweet Generator</h2>
                <p className="text-muted-foreground">Create compelling tweets for your SaaS product</p>
              </div>
              <TweetGenerator />
            </TabsContent>
            <TabsContent value="random" className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Random Tweet Generator</h2>
                <p className="text-muted-foreground">Generate viral tweets based on your mood and style</p>
              </div>
              <RandomTweetGenerator />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
