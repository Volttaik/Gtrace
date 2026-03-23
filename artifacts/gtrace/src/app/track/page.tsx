"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

export default function TrackPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) router.push(`/track/${searchInput.trim()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 flex flex-col pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Tracking Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time status and location updates</p>
          </div>
          <form onSubmit={handleSearch} className="w-full md:w-96 flex gap-2">
            <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Enter Tracking ID..." className="bg-white" />
            <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">Track</Button>
          </form>
        </motion.div>
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
          <Search className="w-16 h-16 mb-4 text-muted-foreground" />
          <h2 className="text-xl font-medium text-foreground">Enter a tracking code to begin</h2>
        </div>
      </main>
    </div>
  );
}
