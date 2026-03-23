import { Link, useLocation } from "wouter"
import { Map, Package } from "lucide-react"

export function Navbar() {
  const [location] = useLocation();

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Map className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              G Trace
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-6">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location === "/"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/track"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.startsWith("/track")
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
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
