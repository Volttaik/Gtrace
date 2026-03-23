import { useState } from "react"
import { useLocation } from "wouter"
import { motion } from "framer-motion"
import { Search, Globe as GlobeIcon, Activity, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/Navbar"
import { MapContainer, TileLayer } from "react-leaflet"

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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
        </MapContainer>
        {/* White overlay */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-[10]"></div>
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="flex-1 flex flex-col pt-20 relative z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col items-center justify-center text-center py-12 lg:py-24">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex flex-col items-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-foreground">
              Track your shipment,<br />anywhere in the world.
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
              Experience real-time global logistics visibility. Enter your tracking ID below to see exactly where your cargo is right now.
            </p>

            <form onSubmit={handleTrack} className="w-full max-w-xl mb-12">
              <div className="flex bg-white rounded-xl p-2 border border-border shadow-sm">
                <div className="flex-1 flex items-center px-4">
                  <Search className="w-5 h-5 text-muted-foreground mr-3" />
                  <Input 
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. TRK-12345)"
                    className="border-0 bg-transparent text-lg focus-visible:ring-0 px-0 h-12 shadow-none"
                  />
                </div>
                <Button type="submit" size="lg" className="rounded-lg px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                  Track
                </Button>
              </div>
            </form>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: <GlobeIcon className="w-4 h-4" />, title: "190+ Countries" },
                { icon: <Activity className="w-4 h-4" />, title: "Real-time Updates" },
                { icon: <Clock className="w-4 h-4" />, title: "Precise ETA" }
              ].map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full shadow-sm text-sm font-medium text-foreground"
                >
                  <div className="text-primary">
                    {feat.icon}
                  </div>
                  {feat.title}
                </motion.div>
              ))}
            </div>
          </motion.div>
          
        </div>
      </main>
    </div>
  )
}
