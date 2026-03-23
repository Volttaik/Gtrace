import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import type { Location } from "@workspace/api-client-react/src/generated/api.schemas";
import L from "leaflet";

interface Props {
  origin: Location;
  destination: Location;
  current: Location;
}

const originIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div class="w-4 h-4 rounded-full bg-white border-4 border-background shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const destIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div class="w-5 h-5 rounded-full bg-accent border-4 border-background shadow-[0_0_15px_rgba(0,255,255,0.8)]"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const currentIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
          <div class="relative w-4 h-4 rounded-full bg-primary border-2 border-background shadow-[0_0_15px_rgba(0,183,255,0.8)]"></div>
        </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function MapBounds({ origin, dest, current }: { origin: Location, dest: Location, current: Location }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds([
      [origin.lat, origin.lng],
      [dest.lat, dest.lng],
      [current.lat, current.lng]
    ]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
  }, [map, origin, dest, current]);
  return null;
}

export function TrackingMap({ origin, destination, current }: Props) {
  const linePositions: [number, number][] = [
    [origin.lat, origin.lng],
    [destination.lat, destination.lng]
  ];

  return (
    <div className="w-full h-full bg-card rounded-2xl overflow-hidden relative z-0 border border-white/5 shadow-2xl">
      <MapContainer 
        center={[0, 0]} 
        zoom={2} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <Polyline 
          positions={linePositions} 
          pathOptions={{ color: 'rgba(255,255,255,0.2)', weight: 2, dashArray: '5, 10' }} 
        />
        
        <Polyline 
          positions={[[origin.lat, origin.lng], [current.lat, current.lng]]} 
          pathOptions={{ color: '#00b7ff', weight: 3 }} 
        />

        <Marker position={[origin.lat, origin.lng]} icon={originIcon} />
        <Marker position={[destination.lat, destination.lng]} icon={destIcon} />
        <Marker position={[current.lat, current.lng]} icon={currentIcon} />
        
        <MapBounds origin={origin} dest={destination} current={current} />
      </MapContainer>
      
      {/* Overlay gradient for fade effect */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(11,16,30,1)] z-[1000]"></div>
    </div>
  );
}
