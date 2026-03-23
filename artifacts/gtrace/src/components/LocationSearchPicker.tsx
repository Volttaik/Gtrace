import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Plane, Anchor, Building2 } from "lucide-react";
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

export function LocationSearchPicker({ value, onChange, placeholder = "Search location...", className }: Props) {
  const [q, setQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useLocationSearch(q);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={isOpen ? q : (value?.name || "")}
          onChange={(e) => {
            setQ(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-4 bg-white border-border shadow-sm"
        />
      </div>

      {isOpen && q.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
          ) : data?.locations?.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No locations found</div>
          ) : (
            <ul className="py-2">
              {data?.locations.map((loc, i) => (
                <li 
                  key={i}
                  onClick={() => {
                    onChange(loc);
                    setIsOpen(false);
                    setQ("");
                  }}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                    {getTypeIcon(loc.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{loc.name}</p>
                    <p className="text-xs text-muted-foreground">{loc.country} • {loc.type}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
