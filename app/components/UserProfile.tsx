"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { motion } from "framer-motion";

export default function UserProfile({
  user,
}: {
  user: { email: string; name?: string } | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 group">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <User className="h-4 w-4 text-primary/60 group-hover:text-primary" />
          </motion.div>
          Profile
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 dark:bg-slate-950 dark:border-slate-800">
        <DropdownMenuLabel className="text-sm font-semibold">
          {user?.name ? `Hello, ${user.name}` : "Loading..."}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs text-muted-foreground">
          Email: {user?.email ?? "Loading..."}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
