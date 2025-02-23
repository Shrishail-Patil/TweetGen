"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Copy, Loader2 } from "lucide-react"

interface TweetGeneratorProps {
  className?: string
}

const tweetTypes = [
  { value: "CTA", label: "Call to Action" },
  { value: "Casual", label: "Casual" },
  { value: "Educational", label: "Educational" },
  { value: "Funny", label: "Funny" },
  { value: "Inspirational", label: "Inspirational" },
]

export default function TweetGenerator({ className }: TweetGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [tweet, setTweet] = useState("")
  const [productDetails, setProductDetails] = useState("")
  const [tweetType, setTweetType] = useState("CTA")
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/gen-tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productDetails, tweetType }),
      })

      if (!response.ok) throw new Error("Failed to generate tweets")

      const data = await response.json()
      setTweet(data.tweet)

      const check = await fetch("/api/gatekeeper", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: data.tweet,
      })

      const checkData = await check.json()
      setTweet(checkData.tweet)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!tweet) return
    navigator.clipboard.writeText(tweet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-8 ${className}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Product Details
          </label>
          <Textarea
            value={productDetails}
            onChange={(e) => setProductDetails(e.target.value)}
            placeholder="Describe your SaaS product..."
            className="min-h-[120px] resize-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Tweet Type
          </label>
          <Select value={tweetType} onValueChange={setTweetType}>
            <SelectTrigger>
              <SelectValue placeholder="Select tweet type" />
            </SelectTrigger>
            <SelectContent>
              {tweetTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Generating..." : "Generate Tweet"}
        </Button>
      </form>

      <AnimatePresence mode="wait">
        {tweet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-card-foreground leading-relaxed">{tweet}</p>
              <Button size="icon" variant="ghost" onClick={handleCopy} className="shrink-0">
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Copy className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

