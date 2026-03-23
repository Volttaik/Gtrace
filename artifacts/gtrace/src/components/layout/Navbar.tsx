import { Link, useLocation } from "wouter"
import { Map, Package, LayoutDashboard } from "lucide-react"
import { motion } from "framer-motion"

export function Navbar() {
  const [location] = useLocation();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 inset-x-0 z-40 border-b border-white/5 glass-panel bg-background/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
              <Map className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              G-Trace
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-6">
            <Link 
              href="/track" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.startsWith('/track') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Track Package</span>
            </Link>
            <Link 
              href="/admin" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.startsWith('/admin') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  )
}
