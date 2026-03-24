"use client";

import { useEffect, useState } from "react";
import { MapPin, Camera, ExternalLink } from "lucide-react";

interface Props {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

interface WikiPhoto {
  title: string;
  description?: string;
  thumbnail?: { source: string };
}

export function LocationPhotoCard({ name, country, lat, lng }: Props) {
  const [photo, setPhoto] = useState<WikiPhoto | null>(null);
  const [photoLoading, setPhotoLoading] = useState(true);

  useEffect(() => {
    setPhotoLoading(true);
    setPhoto(null);

    // Strip airport/hub suffix to get just the city name for Wikipedia
    const cityQuery = name
      .replace(/\s*international airport/i, "")
      .replace(/\s*airport/i, "")
      .replace(/\s*seaport/i, "")
      .replace(/\s*port of\s*/i, "")
      .replace(/g-trace hub\s*-\s*/i, "")
      .split("(")[0]
      .trim();

    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityQuery)}`
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.thumbnail?.source) {
          setPhoto({
            title: data.title,
            description: data.description,
            thumbnail: { source: data.thumbnail.source },
          });
        }
        setPhotoLoading(false);
      })
      .catch(() => setPhotoLoading(false));
  }, [name]);

  const delta = 0.08;
  const osmEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta},${lat - delta},${lng + delta},${lat + delta}&layer=mapnik&marker=${lat},${lng}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=13/${lat}/${lng}`;

  return (
    <div className="card-surface overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Current Position</p>
            <p className="font-semibold text-foreground leading-tight">{name}</p>
            <p className="text-xs text-muted-foreground">{country}</p>
          </div>
        </div>
        <a
          href={osmLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0"
        >
          Open map <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* Wikipedia place photo */}
        <div className="relative h-44 bg-slate-100 overflow-hidden">
          {photoLoading ? (
            <div className="w-full h-full animate-pulse bg-slate-200 flex items-center justify-center">
              <Camera className="w-6 h-6 text-slate-300" />
            </div>
          ) : photo?.thumbnail ? (
            <>
              <img
                src={photo.thumbnail.source}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-xs font-semibold leading-snug drop-shadow">{photo.title}</p>
                {photo.description && (
                  <p className="text-white/75 text-[10px] mt-0.5 leading-snug line-clamp-2">{photo.description}</p>
                )}
              </div>
              <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                <Camera className="w-2.5 h-2.5 text-white/80" />
                <span className="text-[9px] text-white/80 font-medium">Wikipedia</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
              <Camera className="w-7 h-7" />
              <p className="text-xs">No photo available</p>
            </div>
          )}
        </div>

        {/* OpenStreetMap live embed */}
        <div className="relative h-44 bg-slate-100 overflow-hidden">
          <iframe
            src={osmEmbed}
            className="w-full h-full border-0 pointer-events-auto"
            title={`Map of ${name}`}
            loading="lazy"
          />
          <div className="absolute bottom-1 right-1 bg-white/80 backdrop-blur-sm rounded px-1.5 py-0.5">
            <span className="text-[9px] text-slate-500">© OpenStreetMap</span>
          </div>
        </div>
      </div>
    </div>
  );
}
