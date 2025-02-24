"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Check, Copy, Loader2, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const moods = [
  { value: "happy", label: "Happy" },
  { value: "funny", label: "Funny" },
  { value: "sarcastic", label: "Sarcastic" },
  { value: "motivational", label: "Motivational" },
  { value: "controversial", label: "Controversial" },
  { value: "philosophical", label: "Philosophical" },
]

const styles = [
  { value: "viral", label: "Viral" },
  { value: "trendy", label: "Trendy" },
  { value: "casual", label: "Casual" },
  { value: "professional", label: "Professional" },
  { value: "storytelling", label: "Storytelling" },
]

const topics = [
  "Tech",
  "Life",
  "Success",
  "Relationships",
  "Money",
  "Creativity",
  "Growth",
  "Wisdom",
  "Humor",
  "Culture",
]

export default function RandomTweetGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [tweet, setTweet] = useState("")
  const [mood, setMood] = useState("happy")
  const [style, setStyle] = useState("viral")
  const [length, setLength] = useState([140])
  const [copied, setCopied] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState("Tech")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/rand-tweet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          style,
          length: length[0],
          tweetType: selectedTopic, // Align with backend expectations
        }),
      })

      if (!response.ok) throw new Error("Failed to generate tweet")

      const data = await response.json()
      setTweet(data.tweet || "No tweet generated.")
    } catch (err) {
      setError((err as Error).message || "Something went wrong.")
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
      className="space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mood</label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger>
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Style</label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {styles.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tweet Length</label>
            <Slider value={length} onValueChange={setLength} max={280} min={60} step={10} className="py-4" />
            <p className="text-sm text-muted-foreground text-right">{length[0]} characters</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Badge
                  key={topic}
                  variant={selectedTopic === topic ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTopic(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Button disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {isLoading ? "Generating..." : "Generate Random Tweet"}
        </Button>

        {error && <p className="text-sm text-red-500">{error}</p>}
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