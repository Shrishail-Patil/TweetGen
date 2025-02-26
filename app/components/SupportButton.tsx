"use client"

import { useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { Coffee } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SupportButton() {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()

  const handleHoverStart = () => {
    setIsHovered(true)
    controls.start({
      rotate: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    })
  }

  const handleHoverEnd = () => {
    setIsHovered(false)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.a
            href="https://buymeacoffee.com/shrishailpatil"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:shadow-lg transition-shadow"
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={controls}
          >
            <motion.div
              animate={isHovered ? { y: [0, -2, 0, -2, 0] } : {}}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
            >
              <Coffee className="h-5 w-5" />
            </motion.div>
          </motion.a>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-amber-50 text-amber-900 border-amber-200">
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5"
          >
            <span className="font-medium">Support me!!</span>
            <Coffee className="h-3.5 w-3.5" />
          </motion.div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

