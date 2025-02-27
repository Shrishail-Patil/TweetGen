"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Timer } from "lucide-react"

const features = [
  {
    name: "Post automation",
    status: "planned",
    eta: "March 2024",
  },
  {
    name: "Keeping track of generated tweets",
    status: "planned",
    eta: "March 2024",
  },
  {
    name: "Analytics Dashboard",
    status: "ideation",
    eta: "Q2 2024",
  },
]

const statusBadges = {
  planning: "secondary",
  "in-progress": "default",
  planned: "outline",
  ideation: "destructive",
} as const

export default function ComingSoonFeatures() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 group">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Sparkles className="h-4 w-4 text-primary/50 group-hover:text-primary" />
          </motion.div>
          Coming Soon
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[300px] p-0 dark:bg-slate-950 dark:border-slate-800">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b dark:border-slate-800">
            <SheetHeader className="space-y-1">
              <SheetTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-4 w-4" />
                Coming Soon
              </SheetTitle>
              <SheetDescription className="text-xs">Features in our development pipeline</SheetDescription>
            </SheetHeader>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-2 rounded-lg border bg-card hover:bg-accent transition-colors dark:border-slate-800"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{feature.name}</p>
                    <div className="flex items-center gap-2">
                    <Badge variant={statusBadges[feature.status as keyof typeof statusBadges]}>
  {feature.status}
</Badge>
                      <span className="flex items-center text-[10px] text-muted-foreground gap-1">
                        <Timer className="h-3 w-3" />
                        {feature.eta}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

