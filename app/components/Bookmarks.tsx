"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/utils/supabase/supabaseClient";
import { toast } from "sonner";

interface BookmarkEntry {
  id: string;
  tweet: string;
  metadata: {
    tweetType: string;
    structurePreference: string;
    casePreference: string;
    url?: string;
    hashtags?: boolean;
  };
  created_at: string;
}

export default function BookmarksSidebar() {
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchBookmarks = async () => {
    setLoading(true);
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      toast.error("You must be logged in to view bookmarks.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch bookmarks.");
      console.error(error);
    } else {
      setBookmarks(data);
    }
    setLoading(false);
  };

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete bookmark.");
      console.error(error);
    } else {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Bookmark deleted.");
    }
  };

  useEffect(() => {
    if (open) {
      fetchBookmarks();
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Bookmark className="h-4 w-4" />
          Bookmarks
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 dark:bg-slate-950 dark:border-slate-800">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b dark:border-slate-800">
            <SheetHeader className="space-y-1">
              <SheetTitle className="flex items-center gap-2 text-lg">
                <Bookmark className="h-4 w-4" />
                Your Bookmarks
              </SheetTitle>
            </SheetHeader>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : bookmarks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No bookmarks yet.
              </p>
            ) : (
              bookmarks.map((bookmark, index) => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors dark:border-slate-800"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{bookmark.tweet}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline">
                          {bookmark.metadata.tweetType}
                        </Badge>
                        <Badge variant="secondary">
                          {bookmark.metadata.casePreference}
                        </Badge>
                        {bookmark.metadata.hashtags && (
                          <Badge variant="default">#hashtags</Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteBookmark(bookmark.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
