"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner"; // For toast notifications
import { Switch } from "@/components/ui/switch"; // Import the Switch component

interface TweetGeneratorProps {
  className?: string;
}

const tweetTypes = [
  { value: "CTA", label: "Call to Action" },
  { value: "Casual", label: "Casual" },
  { value: "Educational", label: "Educational" },
  { value: "Funny", label: "Funny" },
  { value: "Inspirational", label: "Inspirational" },
  { value: "Viral", label: "Viral" },
  { value: "Controversial", label: "Controversial" },
  { value: "Storytelling", label: "Storytelling" },
];

const structureOptions = [
  { value: "short", label: "Short (1-3 lines)" },
  { value: "long", label: "Long" },
];

const caseOptions = [
  { value: "normal", label: "Normal" },
  { value: "lowercase", label: "Lowercase" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "sentence", label: "Sentence Case" },
  { value: "title", label: "Title Case" },
  { value: "alternating", label: "AlTeRnAtInG cAsE" },
];

export default function TweetGenerator({ className }: TweetGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [tweetType, setTweetType] = useState("CTA");
  const [structurePreference, setStructurePreference] = useState("short");
  const [casePreference, setCasePreference] = useState("normal");
  const [url, setUrl] = useState("");
  const [hashtags, setHashtags] = useState(true); // Hashtags toggle state
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTweet(""); // Clear previous tweet

    try {
      // Send data to backend
      const response = await fetch("/api/gen-tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productDetails,
          tweetType,
          structurePreference,
          casePreference,
          url,
          hashtags, // Include hashtags toggle in the request
        }),
      });

      if (!response.ok) throw new Error("Failed to generate tweet");

      const data = await response.json();
      setTweet(data.tweet);
      toast.success("Tweet generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate tweet. Please try again.");
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
      className={`space-y-8 ${className}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Details */}
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

        {/* URL Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            URL (Optional)
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Tweet Type */}
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

        {/* Tweet Structure */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Tweet Structure
          </label>
          <Select value={structurePreference} onValueChange={setStructurePreference}>
            <SelectTrigger>
              <SelectValue placeholder="Select tweet structure" />
            </SelectTrigger>
            <SelectContent>
              {structureOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tweet Case */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Tweet Case
          </label>
          <Select value={casePreference} onValueChange={setCasePreference}>
            <SelectTrigger>
              <SelectValue placeholder="Select tweet case" />
            </SelectTrigger>
            <SelectContent>
              {caseOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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

        {/* Generate Button */}
        <Button disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Generating..." : "Generate Tweet"}
        </Button>
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