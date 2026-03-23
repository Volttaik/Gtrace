import { useState } from "react"
import { useLocation } from "wouter"
import { motion } from "framer-motion"
import { Search, Globe as GlobeIcon, Activity, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/Navbar"
import { GlobeVis } from "@/components/GlobeVis"

export default function Home() {
  const [, setLocation] = useLocation();
  const [trackingId, setTrackingId] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setLocation(`/track/${trackingId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Image requested from requirements */}
      <div className="absolute inset-0 z-[-2]">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
          alt="Space background" 
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      <div className="absolute inset-0 z-[-1] bg-gradient-to-b from-background/40 via-background/80 to-background"></div>

      <Navbar />

      <main className="flex-1 flex flex-col pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col lg:flex-row items-center relative z-10 py-12 lg:py-24">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 pt-10 lg:pt-0 z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
                Track your package <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  anywhere in the world.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
                Experience real-time global logistics visibility. Enter your tracking ID below to see exactly where your cargo is right now.
              </p>

              <form onSubmit={handleTrack} className="relative max-w-xl group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative flex glass-panel rounded-2xl p-2">
                  <div className="flex-1 flex items-center px-4">
                    <Search className="w-5 h-5 text-muted-foreground mr-3" />
                    <Input 
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="Enter Tracking ID (e.g. TRK-12345)"
                      className="border-0 bg-transparent text-lg focus-visible:ring-0 px-0 h-12"
                    />
                  </div>
                  <Button type="submit" size="lg" className="rounded-xl px-8 h-12">
                    Track Now
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
              {[
                { icon: <GlobeIcon className="w-6 h-6 text-primary" />, title: "Global Coverage", desc: "Track across 190+ countries" },
                { icon: <Activity className="w-6 h-6 text-accent" />, title: "Real-time Updates", desc: "Live location syncing" },
                { icon: <Clock className="w-6 h-6 text-blue-400" />, title: "Precise ETA", desc: "AI-powered delivery estimates" }
              ].map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                  className="glass-card p-5"
                >
                  <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    {feat.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 3D Globe */}
          <div className="w-full lg:w-1/2 absolute lg:relative inset-0 lg:inset-auto opacity-30 lg:opacity-100 pointer-events-none lg:pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full flex items-center justify-center"
            >
              <GlobeVis />
            </motion.div>
          </div>
          
        </div>
      </main>
    </div>
  )
}
