"use client"
import { useState } from "react"
import { motion } from "framer-motion"

export default function TweetGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [tweet, setTweet] = useState("")
  const [productDetails, setProductDetails] = useState("")
  const [copied, setCopied] = useState(false) // Track copy state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/gen-tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productDetails }),
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

    // Reset "Copied!" message after 2 seconds
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
    >
      <form onSubmit={handleSubmit} className="mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <label htmlFor="productDetails" className="block text-sm font-medium text-gray-700 mb-2">
            SaaS Product Details
          </label>
          <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <textarea
              id="productDetails"
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              rows={4}
              placeholder="Enter your SaaS product details here..."
              required
            />
          </motion.div>
        </motion.div>
        <motion.button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Tweets"}
        </motion.button>
      </form>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Generated Tweets</h2>
        <motion.div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          {tweet ? (
            <>
              <p className="text-gray-700 flex-1">{tweet}</p>
              <motion.button
                onClick={handleCopy}
                className="ml-4 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? "Copied!" : "Copy"}
              </motion.button>
            </>
          ) : (
            <p className="text-gray-500">No tweets generated yet...</p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}