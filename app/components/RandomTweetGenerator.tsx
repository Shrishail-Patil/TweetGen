"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Check, Copy, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner"; // For better toast notifications

const moods = [
  { value: "happy", label: "Happy" },
  { value: "funny", label: "Funny" },
  { value: "sarcastic", label: "Sarcastic" },
  { value: "motivational", label: "Motivational" },
  { value: "controversial", label: "Controversial" },
  { value: "philosophical", label: "Philosophical" },
  { value: "nostalgic", label: "Nostalgic" },
  { value: "mysterious", label: "Mysterious" },
  { value: "romantic", label: "Romantic" },
  { value: "adventurous", label: "Adventurous" },
];

const styles = [
  { value: "viral", label: "Viral" },
  { value: "trendy", label: "Trendy" },
  { value: "casual", label: "Casual" },
  { value: "professional", label: "Professional" },
  { value: "storytelling", label: "Storytelling" },
  { value: "poetic", label: "Poetic" },
  { value: "informative", label: "Informative" },
  { value: "inspirational", label: "Inspirational" },
  { value: "satirical", label: "Satirical" },
  { value: "dramatic", label: "Dramatic" },
];

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
  "Health",
  "Environment",
  "Education",
  "Travel",
  "Food",
];

const structures = [
  { value: "lowercase", label: "Lowercase" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "sentence", label: "Sentence Case" },
  { value: "title", label: "Title Case" },
  { value: "alternating", label: "AlTeRnAtInG cAsE" },
  { value: "random", label: "RaNDoM cASe" },
];

export default function RandomTweetGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [mood, setMood] = useState("happy");
  const [style, setStyle] = useState("viral");
  const [length, setLength] = useState([140]);
  const [copied, setCopied] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("Tech");
  const [selectedStructure, setSelectedStructure] = useState("sentence");
  const [hashtags, setHashtags] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTweet(""); // Clear previous tweet

    try {
      const response = await fetch("/api/rand-tweet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          style,
          length: length[0],
          tweetType: selectedTopic,
          structure: selectedStructure,
          hashtags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate tweet. Please try again.");
      }

      const data = await response.json();
      if (!data.tweet) {
        throw new Error("No tweet generated. Please try again.");
      }

      setTweet(data.tweet);
      toast.success("Tweet generated successfully!");
    } catch (err) {
      setError((err as Error).message);
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!tweet) return;
    navigator.clipboard.writeText(tweet);
    setCopied(true);
    toast.success("Tweet copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Mood Selector */}
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

          {/* Style Selector */}
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

          {/* Tweet Length Slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tweet Length</label>
            <Slider value={length} onValueChange={setLength} max={280} min={60} step={10} className="py-4" />
            <p className="text-sm text-muted-foreground text-right">{length[0]} characters</p>
          </div>

          {/* Topic Selector */}
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

          {/* Structure Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Structure</label>
            <Select value={selectedStructure} onValueChange={setSelectedStructure}>
              <SelectTrigger>
                <SelectValue placeholder="Select structure" />
              </SelectTrigger>
              <SelectContent>
                {structures.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hashtags Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Include Hashtags</label>
            <div className="flex items-center gap-2">
              <Switch checked={hashtags} onCheckedChange={setHashtags} />
              <span className="text-sm">{hashtags ? "Enabled" : "Disabled"}</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {isLoading ? "Generating..." : "Generate Random Tweet"}
        </Button>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>

      {/* Generated Tweet */}
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
  );
}