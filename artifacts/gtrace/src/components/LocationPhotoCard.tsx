"use client";

import { useEffect, useState } from "react";
import { MapPin, Camera, ImageOff } from "lucide-react";

interface Props {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

interface PhotoResult {
  url: string;
  source: string;
  label?: string;
  description?: string;
}

// Normalise location name — strip airport/hub/port suffixes to get the city core
function normaliseName(name: string): string {
  return name
    .replace(/\s*international\s+airport/gi, "")
    .replace(/\s*\bairport\b/gi, "")
    .replace(/\s*\bseaport\b/gi, "")
    .replace(/\s*port\s+of\s+/gi, "")
    .replace(/g-trace\s+hub\s*[-–]\s*/gi, "")
    .replace(/\s*\(.*?\)/g, "")
    .trim();
}

// Slug for Teleport API: lowercase, hyphens
function toTeleportSlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Fetch with a hard timeout
async function fetchWithTimeout(url: string, ms = 4000): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    return r;
  } finally {
    clearTimeout(id);
  }
}

// --- Individual API fetchers ---

async function fromTeleport(city: string): Promise<PhotoResult | null> {
  try {
    const slug = toTeleportSlug(city);
    const r = await fetchWithTimeout(
      `https://api.teleport.org/api/urban_areas/slug:${slug}/images/`
    );
    if (!r.ok) return null;
    const d = await r.json();
    const photo = d?.photos?.[0];
    if (!photo?.image?.web) return null;
    return {
      url: photo.image.web,
      source: "Teleport",
      label: photo.attribution?.name ?? undefined,
    };
  } catch {
    return null;
  }
}

async function fromWikipediaRest(query: string): Promise<PhotoResult | null> {
  try {
    const r = await fetchWithTimeout(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    );
    if (!r.ok) return null;
    const d = await r.json();
    if (!d?.thumbnail?.source) return null;
    return {
      url: d.thumbnail.source,
      source: "Wikipedia",
      description: d.description ?? undefined,
    };
  } catch {
    return null;
  }
}

async function fromWikipediaPageImages(query: string): Promise<PhotoResult | null> {
  try {
    const url =
      `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages` +
      `&titles=${encodeURIComponent(query)}&pithumbsize=1200&format=json&origin=*`;
    const r = await fetchWithTimeout(url);
    if (!r.ok) return null;
    const d = await r.json();
    const pages = d?.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0] as { thumbnail?: { source: string } };
    if (!page?.thumbnail?.source) return null;
    return { url: page.thumbnail.source, source: "Wikimedia" };
  } catch {
    return null;
  }
}

async function fromWikimediaCommonsSearch(query: string): Promise<PhotoResult | null> {
  try {
    const url =
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
      `&gsrsearch=${encodeURIComponent(query + " city")}&gsrnamespace=6` +
      `&prop=pageimages&pithumbsize=1000&format=json&origin=*`;
    const r = await fetchWithTimeout(url);
    if (!r.ok) return null;
    const d = await r.json();
    const pages = d?.query?.pages;
    if (!pages) return null;
    const sorted = Object.values(pages) as { index?: number; thumbnail?: { source: string } }[];
    sorted.sort((a, b) => (a.index ?? 999) - (b.index ?? 999));
    const hit = sorted.find((p) => p.thumbnail?.source);
    if (!hit?.thumbnail?.source) return null;
    return { url: hit.thumbnail.source, source: "Commons" };
  } catch {
    return null;
  }
}

async function fromCountryWikipedia(country: string): Promise<PhotoResult | null> {
  try {
    const r = await fetchWithTimeout(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(country)}`
    );
    if (!r.ok) return null;
    const d = await r.json();
    if (!d?.thumbnail?.source) return null;
    return {
      url: d.thumbnail.source,
      source: "Wikipedia",
      description: d.description ?? undefined,
    };
  } catch {
    return null;
  }
}

// SOURCE BADGE COLOURS
const SOURCE_COLOUR: Record<string, string> = {
  Teleport: "bg-violet-600",
  Wikipedia: "bg-slate-700",
  Wikimedia: "bg-blue-700",
  Commons: "bg-teal-700",
};

export function LocationPhotoCard({ name, country, lat, lng }: Props) {
  const [photo, setPhoto] = useState<PhotoResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setPhoto(null);

    const city = normaliseName(name);

    // Launch all 5 sources in parallel, resolve to ordered priority results
    const tasks: Promise<PhotoResult | null>[] = [
      fromTeleport(city),                      // 1 – best quality
      fromWikipediaRest(city),                 // 2 – broad coverage
      fromWikipediaPageImages(city),           // 3 – higher res Wikipedia
      fromWikimediaCommonsSearch(city),        // 4 – Commons image search
      fromCountryWikipedia(country),           // 5 – country-level fallback
    ];

    // Pick first non-null in priority order as each resolves
    let settled = 0;
    let winner: PhotoResult | null = null;

    const results: (PhotoResult | null)[] = new Array(tasks.length).fill(undefined);

    tasks.forEach((task, idx) => {
      task.then((res) => {
        results[idx] = res ?? null;
        settled++;

        // Check if we have a winner: the highest-priority resolved & non-null
        for (let i = 0; i < results.length; i++) {
          if (results[i] === undefined) break; // still waiting for a higher-priority source
          if (results[i] !== null) {
            if (!winner) {
              winner = results[i]!;
              setPhoto(winner);
            }
            break;
          }
        }

        if (settled === tasks.length) {
          setLoading(false);
        }
      }).catch(() => {
        results[idx] = null;
        settled++;
        if (settled === tasks.length) setLoading(false);
      });
    });
  }, [name, country]);

  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=13/${lat}/${lng}`;
  const badge = photo ? (SOURCE_COLOUR[photo.source] ?? "bg-slate-700") : "";

  return (
    <div className="card-surface overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Current Position
            </p>
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
          <MapPin className="w-3 h-3" /> View on map
        </a>
      </div>

      {/* Photo area */}
      <div className="relative w-full h-56 bg-slate-100 overflow-hidden">
        {loading && !photo && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center">
            <Camera className="w-8 h-8 text-slate-300 animate-pulse" />
          </div>
        )}

        {photo && (
          <>
            <img
              key={photo.url}
              src={photo.url}
              alt={`${name} — ${photo.source}`}
              className="w-full h-full object-cover transition-opacity duration-500"
              onError={(e) => {
                // If the winning image 404s, clear it so the placeholder shows
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

            {/* Bottom meta */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {photo.description && (
                <p className="text-white/80 text-[11px] mb-1 line-clamp-1 drop-shadow">
                  {photo.description}
                </p>
              )}
              {photo.label && (
                <p className="text-white/60 text-[10px] drop-shadow">
                  Photo: {photo.label}
                </p>
              )}
            </div>

            {/* Source badge */}
            <div
              className={`absolute top-3 right-3 ${badge} rounded-full px-2.5 py-1 flex items-center gap-1.5`}
            >
              <Camera className="w-2.5 h-2.5 text-white/90" />
              <span className="text-[10px] text-white font-semibold tracking-wide">
                {photo.source}
              </span>
            </div>
          </>
        )}

        {!loading && !photo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
            <ImageOff className="w-8 h-8" />
            <p className="text-sm font-medium">No photo found</p>
            <p className="text-xs text-slate-300">{name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
