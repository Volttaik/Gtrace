import { useState } from "react"
import { useRoute, useLocation } from "wouter"
import { motion } from "framer-motion"
import { Search, MapPin, Truck, CheckCircle, Package, ArrowRight, Clock, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/Navbar"
import { TrackingMap } from "@/components/TrackingMap"
import { useTracking } from "@/hooks/use-packages"
import { formatDate } from "@/lib/utils"

export default function Tracking() {
  const [match, params] = useRoute("/track/:id");
  const urlId = match ? params.id : "";
  const [searchInput, setSearchInput] = useState(urlId || "");
  
  const { data: pkg, isLoading, isError } = useTracking(urlId);

  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && searchInput !== urlId) {
      setLocation(`/track/${searchInput.trim()}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'in_transit': return 'text-primary bg-primary/10 border-primary/20';
      case 'exception': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'out_for_delivery': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-muted-foreground bg-white/5 border-white/10';
    }
  };

  const getEventIcon = (status: string) => {
    if (status.toLowerCase().includes('deliver')) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status.toLowerCase().includes('transit')) return <Truck className="w-5 h-5 text-primary" />;
    if (status.toLowerCase().includes('exception')) return <AlertTriangle className="w-5 h-5 text-destructive" />;
    return <Package className="w-5 h-5 text-muted-foreground" />;
  };

  const progress = pkg?.totalDistance && pkg?.distanceTravelled 
    ? Math.min(100, Math.round((pkg.distanceTravelled / pkg.totalDistance) * 100))
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex flex-col pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
        
        {/* Search Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1 className="text-3xl font-display font-bold">Tracking Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time status and location updates</p>
          </div>
          <form onSubmit={handleSearch} className="w-full md:w-96 flex gap-2">
            <Input 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Tracking ID..."
              className="bg-card"
            />
            <Button type="submit" variant="default">Track</Button>
          </form>
        </motion.div>

        {!urlId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
            <Search className="w-16 h-16 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-medium text-foreground">Enter a tracking code to begin</h2>
          </div>
        ) : isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : isError || !pkg ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center bg-card/50 rounded-2xl border border-white/5 p-12">
            <AlertTriangle className="w-12 h-12 mb-4 text-destructive" />
            <h2 className="text-xl font-medium text-foreground">Package Not Found</h2>
            <p className="text-muted-foreground mt-2">We couldn't find a package with ID: {urlId}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Details & Timeline */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Main Status Card */}
              <div className="glass-card p-6 border-t-4 border-t-primary">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(pkg.status)}`}>
                      {pkg.status.replace(/_/g, ' ')}
                    </span>
                    <h2 className="text-2xl font-bold mt-3 font-display">{pkg.trackingId}</h2>
                    <p className="text-foreground mt-1 font-medium">{pkg.name}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Origin</span>
                    <span className="font-medium">{pkg.origin.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Destination</span>
                    <span className="font-medium">{pkg.destination.name}</span>
                  </div>
                  {pkg.estimatedDelivery && (
                    <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
                      <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-4 h-4"/> ETA</span>
                      <span className="font-bold text-accent">{formatDate(pkg.estimatedDelivery)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Scheduled Move Info */}
              {pkg.scheduledMove && (
                <div className="glass-card p-5 bg-accent/5 border-accent/20">
                  <h3 className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Scheduled Move Active
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    Moving to <span className="text-foreground">{pkg.scheduledMove.targetLocation.name}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Arrives: {formatDate(pkg.scheduledMove.arrivalDate)} ({pkg.scheduledMove.arrivesInDays} days)
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div className="glass-card p-6">
                <h3 className="font-semibold text-lg mb-6">Tracking History</h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:w-0.5 before:bg-white/10 before:z-0">
                  {pkg.history.map((event, i) => (
                    <div key={i} className="relative z-10 flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-card border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                        {getEventIcon(event.status)}
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-medium text-foreground">{event.status}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{event.description}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {event.location.name} • {formatDate(event.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {pkg.history.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No tracking events yet.</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Column: Map & Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6 flex flex-col"
            >
              {/* Progress Bar */}
              <div className="glass-card p-6">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-sm text-muted-foreground">Transit Progress</div>
                  <div className="text-2xl font-bold font-display">{progress}%</div>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden mt-3">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-sm"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-3">
                  <span>{pkg.distanceTravelled?.toLocaleString() || 0} km travelled</span>
                  <span>{pkg.totalDistance?.toLocaleString() || 0} km total</span>
                </div>
              </div>

              {/* Map */}
              <div className="flex-1 min-h-[400px] lg:min-h-[500px]">
                <TrackingMap origin={pkg.origin} destination={pkg.destination} current={pkg.currentLocation} />
              </div>
            </motion.div>

          </div>
        )}
      </main>
    </div>
  )
}
