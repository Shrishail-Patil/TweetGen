"use client"

import { motion } from "framer-motion"
import { FaTwitter, FaCloud, FaRocket } from "react-icons/fa"

const floatingElements = [
  { Icon: FaTwitter, x: "10%", y: "20%", size: 30, duration: 5 },
  { Icon: FaCloud, x: "80%", y: "60%", size: 40, duration: 7 },
  { Icon: FaRocket, x: "60%", y: "10%", size: 35, duration: 6 },
  { Icon: FaTwitter, x: "30%", y: "70%", size: 25, duration: 8 },
  { Icon: FaCloud, x: "70%", y: "40%", size: 45, duration: 9 },
]

export default function FloatingElements() {
  return (
    <>
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-blue-300 opacity-20"
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
    </>
  )
}

