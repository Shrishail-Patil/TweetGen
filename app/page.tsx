"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import FloatingElements from "./components/FloatingElements"
import TweetGenerator from "./components/TweetGenerator"

export default function Page() {
  const [isDark, setIsDark] = useState(true)

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${isDark ? "dark" : ""}`}>
      <div className="relative min-h-screen bg-background text-foreground">
        <FloatingElements />
        <nav className="fixed top-0 right-0 p-4 z-50">
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
        <main className="container max-w-5xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold tracking-tight mb-4">Tweet Geni</h1>
            <p className="text-muted-foreground text-lg">Generate engaging tweets for your SaaS product with AI</p>
          </motion.div>
          <TweetGenerator />
        </main>
      </div>
    </div>
  )
}

