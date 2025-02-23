"use client"

import { motion } from "framer-motion"
import { Cloud, Twitter, Rocket, Sparkles, MessageCircle } from "lucide-react"

const floatingElements = [
  { Icon: Twitter, x: "10%", y: "20%", size: 24, duration: 5 },
  { Icon: Cloud, x: "80%", y: "60%", size: 32, duration: 7 },
  { Icon: Rocket, x: "60%", y: "10%", size: 28, duration: 6 },
  { Icon: Sparkles, x: "30%", y: "70%", size: 20, duration: 8 },
  { Icon: MessageCircle, x: "70%", y: "40%", size: 36, duration: 9 },
]

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/10"
          style={{ left: element.x, top: element.y }}
          animate={{
            y: ["0%", "20%", "0%"],
          }}
          transition={{
            duration: element.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <element.Icon size={element.size} />
        </motion.div>
      ))}
    </div>
  )
}

