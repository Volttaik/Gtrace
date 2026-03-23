import { Link, useLocation } from "wouter"
import { Map, Package } from "lucide-react"
import { useEffect, useState } from "react"

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(2,6,23,0.9)"
          : "rgba(2,6,23,0.4)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(51,65,85,0.6)" : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-700"
            >
              <Map className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              G<span className="text-blue-400">-</span>Trace
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location === "/"
                  ? "text-white bg-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/6"
              }`}
            >
              Home
            </Link>
            <Link
              href="/track"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.startsWith("/track")
                  ? "text-white bg-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/6"
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
