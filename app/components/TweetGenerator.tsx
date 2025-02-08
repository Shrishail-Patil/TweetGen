"use client"
import { useState } from "react"
import { motion} from "framer-motion"

export default function TweetGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [tweet, setTweet] = useState("")
  const [productDetails, setProductDetails] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent form from reloading before API call

    setIsLoading(true)

    try {
      const response = await fetch("/api/gen-tweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productDetails }), // Send JSON object
      })

      if (!response.ok) {
        throw new Error("Failed to generate tweets")
      }

      const data = await response.json()
      setTweet(data.tweet) // Assuming API returns a `tweet` field
      const check = await fetch("/api/gatekeeper", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: data.tweet, // Send JSON object
      })
      const checkData = await check.json()
      setTweet(checkData.tweet)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
    >
      <motion.div>
        <form onSubmit={handleSubmit} className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
            {isLoading ? (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Generating...
              </motion.span>
            ) : (
              "Generate Tweets"
            )}
          </motion.button>
        </form>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Generated Tweets</h2>
          <motion.div
            className="bg-gray-100 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {tweet ? (
              <p className="text-gray-700">{tweet}</p>
            ) : (
              <p className="text-gray-500">No tweets generated yet...</p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}