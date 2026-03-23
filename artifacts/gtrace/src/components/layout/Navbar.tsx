import { Link, useLocation } from "wouter"
import { Map, Package } from "lucide-react"
import { useEffect, useState } from "react"

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.75)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(226,232,240,1)" : "1px solid rgba(226,232,240,0.4)",
        boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-700">
              <Map className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              G<span className="text-blue-700">-</span>Trace
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location === "/"
                  ? "text-blue-700 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Home
            </Link>
            <Link
              href="/track"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.startsWith("/track")
                  ? "text-blue-700 bg-blue-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Track</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
