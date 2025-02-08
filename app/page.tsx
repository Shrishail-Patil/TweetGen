import TweetGenerator from "@/app/components/TweetGenerator"
import FloatingElements from "./components/FloatingElements"
import { Analytics } from "@vercel/analytics/react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 relative overflow-hidden">
      <Analytics/>
      <FloatingElements />
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 relative z-10">SaaS Tweet Generator</h1>
      <TweetGenerator />
    </main>
  )
}

