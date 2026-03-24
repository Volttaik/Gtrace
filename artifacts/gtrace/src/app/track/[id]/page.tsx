"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Truck, CheckCircle, Package, Clock, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import dynamic from "next/dynamic";
import { useTracking } from "@/hooks/use-packages";
import { formatDate } from "@/lib/utils";
import { LocationPhotoCard } from "@/components/LocationPhotoCard";

const TrackingMap = dynamic(
  () => import("@/components/TrackingMap").then((m) => ({ default: m.TrackingMap })),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-100 rounded-xl animate-pulse" /> }
);

export default function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: urlId } = use(params);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(urlId || "");

  const { data: pkg, isLoading, isError } = useTracking(urlId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && searchInput !== urlId) {
      router.push(`/track/${searchInput.trim()}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-700 bg-green-100 border-green-200";
      case "in_transit": return "text-blue-700 bg-blue-100 border-blue-200";
      case "exception": return "text-red-700 bg-red-100 border-red-200";
      case "out_for_delivery": return "text-indigo-700 bg-indigo-100 border-indigo-200";
      default: return "text-slate-700 bg-slate-100 border-slate-200";
    }
  };

  const getEventIcon = (status: string) => {
    if (status.toLowerCase().includes("deliver")) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status.toLowerCase().includes("transit")) return <Truck className="w-5 h-5 text-blue-600" />;
    if (status.toLowerCase().includes("exception")) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    return <Package className="w-5 h-5 text-slate-500" />;
  };

  const progress = pkg?.totalDistance && pkg?.distanceTravelled
    ? Math.min(100, Math.round((pkg.distanceTravelled / pkg.totalDistance) * 100))
    : 0;

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

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : isError || !pkg ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-border shadow-sm p-12">
            <AlertTriangle className="w-12 h-12 mb-4 text-destructive" />
            <h2 className="text-xl font-medium text-foreground">Package Not Found</h2>
            <p className="text-muted-foreground mt-2">We couldn&apos;t find a package with ID: {urlId}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-6">
              <div className="card-surface p-6 border-t-4 border-t-primary">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(pkg.status)}`}>
                      {pkg.status.replace(/_/g, " ")}
                    </span>
                    <h2 className="text-2xl font-bold mt-3 font-display text-foreground">{pkg.trackingId}</h2>
                    <p className="text-slate-600 mt-1 font-medium">{pkg.name}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Origin</span>
                    <span className="font-medium text-foreground">{pkg.origin.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Destination</span>
                    <span className="font-medium text-foreground">{pkg.destination.name}</span>
                  </div>
                  {pkg.estimatedDelivery && (
                    <div className="flex items-center justify-between text-sm pt-4 border-t border-border mt-4">
                      <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-4 h-4" /> ETA</span>
                      <span className="font-bold text-primary">{formatDate(pkg.estimatedDelivery)}</span>
                    </div>
                  )}
                </div>
              </div>

              {pkg.scheduledMove && (
                <div className="card-surface p-5 bg-blue-50/50 border-blue-100">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Scheduled Move Active
                  </h3>
                  <p className="text-sm text-slate-600 mb-1">Moving to <span className="font-medium text-slate-900">{pkg.scheduledMove.targetLocation.name}</span></p>
                  <p className="text-xs text-slate-500">Arrives: {formatDate(pkg.scheduledMove.arrivalDate)} ({pkg.scheduledMove.arrivesInDays} days)</p>
                </div>
              )}

              <div className="card-surface p-6">
                <h3 className="font-semibold text-lg mb-6 text-foreground">Tracking History</h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:w-0.5 before:bg-gray-200 before:z-0">
                  {pkg.history.map((event, i) => (
                    <div key={i} className="relative z-10 flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                        {getEventIcon(event.status)}
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-medium text-foreground">{event.status}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{event.description}</p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
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

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 space-y-6 flex flex-col">
              <div className="card-surface p-6">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-sm text-muted-foreground">Transit Progress</div>
                  <div className="text-2xl font-bold font-display text-foreground">{progress}%</div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-primary relative rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-3">
                  <span>{pkg.distanceTravelled?.toLocaleString() || 0} km travelled</span>
                  <span>{pkg.totalDistance?.toLocaleString() || 0} km total</span>
                </div>
              </div>
              {pkg.currentLocation && (
                <LocationPhotoCard
                  name={pkg.currentLocation.name}
                  country={pkg.currentLocation.country ?? ""}
                  lat={pkg.currentLocation.lat}
                  lng={pkg.currentLocation.lng}
                />
              )}

              <div className="flex-1 min-h-[400px] lg:min-h-[500px]">
                <TrackingMap origin={pkg.origin} destination={pkg.destination} current={pkg.currentLocation} />
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
