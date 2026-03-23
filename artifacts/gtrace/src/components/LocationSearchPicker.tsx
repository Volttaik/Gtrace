"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Plane, Anchor, Building2, X } from "lucide-react";
import { Input } from "./ui/input";
import { useLocationSearch } from "@/hooks/use-packages";
import type { Location } from "@workspace/api-client-react/src/generated/api.schemas";
import { cn } from "@/lib/utils";

interface Props {
  value?: Location;
  onChange: (location: Location) => void;
  placeholder?: string;
  className?: string;
}

export function LocationSearchPicker({ value, onChange, placeholder = "Search city, port or airport...", className }: Props) {
  const [q, setQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useLocationSearch(q);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "airport": return <Plane className="w-4 h-4 text-blue-600" />;
      case "port": return <Anchor className="w-4 h-4 text-blue-500" />;
      case "city": return <Building2 className="w-4 h-4 text-slate-500" />;
      default: return <MapPin className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const map: Record<string, string> = {
      airport: "bg-blue-50 text-blue-600 border-blue-100",
      port: "bg-sky-50 text-sky-600 border-sky-100",
      city: "bg-slate-50 text-slate-500 border-slate-200",
      warehouse: "bg-amber-50 text-amber-600 border-amber-100",
    };
    return map[type] ?? "bg-slate-50 text-slate-500 border-slate-200";
  };

  const handleClear = () => {
    setQ("");
    onChange({ name: "", country: "", type: "city", lat: 0, lng: 0 } as unknown as Location);
    inputRef.current?.focus();
  };

  const displayValue = isOpen ? q : (value?.name || "");
  const hasValue = !isOpen && value?.name;

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <Input
          ref={inputRef}
          value={displayValue}
          onChange={(e) => { setQ(e.target.value); setIsOpen(true); }}
          onFocus={() => { setIsOpen(true); if (value?.name) setQ(""); }}
          placeholder={placeholder}
          className="pl-9 pr-8 bg-white border-slate-200 shadow-sm focus:border-blue-400 focus:ring-blue-100 text-slate-900 placeholder:text-slate-400"
        />
        {hasValue && (
          <button type="button" onClick={handleClear} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && q.length >= 1 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-slate-400">
              <span className="inline-flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />Searching…</span>
            </div>
          ) : !data?.locations?.length ? (
            <div className="p-4 text-center text-sm text-slate-400">No locations found for &quot;{q}&quot;</div>
          ) : (
            <ul>
              {data.locations.map((loc, i) => (
                <li key={i} onClick={() => { onChange(loc); setIsOpen(false); setQ(""); }} className="px-3 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-slate-100 last:border-0">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0">{getTypeIcon(loc.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{loc.name}</p>
                    <p className="text-xs text-slate-400">{loc.country}</p>
                  </div>
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize flex-shrink-0", getTypeBadge(loc.type))}>{loc.type}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isOpen && q.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-50 px-4 py-3">
          <p className="text-xs text-slate-400">Type a city, port, or airport name to search</p>
        </div>
      )}
    </div>
  );
}
