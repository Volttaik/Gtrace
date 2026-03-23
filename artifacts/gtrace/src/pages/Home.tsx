import { useState, useRef, useEffect } from "react"
import { useLocation } from "wouter"
import { motion, useInView, useAnimation } from "framer-motion"
import {
  Search, Globe as GlobeIcon, Activity, Clock, Package,
  CheckCircle2, Map, Plane, Ship, Truck, ArrowRight,
  BarChart3, Route, Ruler, ClipboardList, CalendarClock, Layers
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/Navbar"
import { MapContainer, TileLayer } from "react-leaflet"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = 16
    const increment = target / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setVal(target)
        clearInterval(timer)
      } else {
        setVal(Math.floor(start))
      }
    }, step)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const FEATURES = [
  { icon: <BarChart3 className="w-6 h-6" />, title: "Real-time Location", desc: "See exactly where your shipment is at any moment with live GPS coordinates and map pins." },
  { icon: <Route className="w-6 h-6" />, title: "Route Visualization", desc: "Interactive maps show the full journey from origin to destination with animated paths." },
  { icon: <Ruler className="w-6 h-6" />, title: "Distance Tracking", desc: "Know exactly how far your package has traveled and how far it still needs to go." },
  { icon: <ClipboardList className="w-6 h-6" />, title: "Delivery Timeline", desc: "Full event history with timestamps, location notes, and carrier status updates." },
  { icon: <CalendarClock className="w-6 h-6" />, title: "Schedule Updates", desc: "Plan ahead with automated location update scheduling for predictable arrivals." },
  { icon: <Layers className="w-6 h-6" />, title: "Multi-modal Support", desc: "Air, sea, road, and rail — all tracking modes unified in one dashboard." },
]

export default function Home() {
  const [, setLocation] = useLocation()
  const [trackingId, setTrackingId] = useState("")

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingId.trim()) {
      setLocation(`/track/${trackingId.trim()}`)
    }
  }

  return (
    <div className="flex flex-col bg-white">
      <Navbar />

      {/* ───────────── HERO ───────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          </MapContainer>
          <div className="absolute inset-0 bg-white/65 backdrop-blur-[1.5px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center pt-20">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide mb-6 border border-primary/20">
              <GlobeIcon className="w-3.5 h-3.5" /> GLOBAL LOGISTICS TRACKING
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05] text-slate-900 mb-6"
          >
            Track your shipment,{" "}
            <span className="text-primary">anywhere</span>{" "}
            in the world.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto"
          >
            Real-time global logistics visibility. One tracking ID. Full visibility from departure to doorstep — across 190+ countries.
          </motion.p>

          <motion.form
            onSubmit={handleTrack}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="w-full max-w-xl mx-auto mb-10"
          >
            <div className="flex bg-white rounded-2xl p-2 border border-slate-200 shadow-md shadow-slate-200/60">
              <div className="flex-1 flex items-center px-4">
                <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                <Input
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Tracking ID (e.g. GT-ABC-1234)"
                  className="border-0 bg-transparent text-base focus-visible:ring-0 px-0 h-12 shadow-none placeholder:text-slate-400"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-xl px-7 h-12 bg-primary hover:bg-primary/90 text-white font-semibold">
                Track <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </motion.form>

          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { icon: <GlobeIcon className="w-4 h-4" />, label: "190+ Countries" },
              { icon: <Activity className="w-4 h-4" />, label: "Real-time Tracking" },
              { icon: <Plane className="w-4 h-4" />, label: "Air · Sea · Land" },
              { icon: <Clock className="w-4 h-4" />, label: "24/7 Visibility" },
            ].map((p, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 shadow-sm"
              >
                <span className="text-primary">{p.icon}</span> {p.label}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        >
          <span className="text-xs text-slate-400 font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="w-5 h-8 rounded-full border-2 border-slate-300 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-slate-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ───────────── TRUCK SECTION ───────────── */}
      <section className="bg-white py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-4">
                Global Delivery Network
              </motion.span>
              <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-slate-900 leading-tight mb-6">
                Built for every delivery,<br />everywhere.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-600 text-lg leading-relaxed mb-4">
                From bustling megaports in Shanghai and Rotterdam to quiet neighborhoods in rural Africa — G Trace powers visibility across every mile of the journey. Our platform connects thousands of carriers, freight forwarders, and last-mile couriers under one unified tracking system.
              </motion.p>
              <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-4">
                Whether your cargo is crossing the Pacific in a 20,000 TEU container ship, cruising at 35,000 feet in a cargo hold, or loaded on a delivery van three blocks away, G Trace knows exactly where it is — and when it will arrive.
              </motion.p>
              <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-8">
                We support multi-modal shipments — packages that start by air, transfer to sea freight, then complete their journey by road — with seamless handover tracking at every transition point.
              </motion.p>
              <motion.ul variants={stagger} className="space-y-3">
                {[
                  "190+ countries and territories covered",
                  "Air, sea, road, and rail freight supported",
                  "Real-time GPS and carrier API integration",
                  "Automated event updates at every checkpoint",
                  "Multi-modal handover tracking",
                  "24/7 monitoring with instant alert delivery",
                ].map((item) => (
                  <motion.li key={item} variants={fadeUp} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatedSection>

            {/* TRUCK IMAGE — 3D pop-out effect */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-80 h-80 bg-blue-50 rounded-full" />
              <div className="absolute w-64 h-64 bg-blue-100/50 rounded-full scale-75 translate-y-8" />
              <motion.div
                initial={{ opacity: 0, y: 30, rotateY: -8 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                style={{ perspective: 800 }}
                className="relative z-10"
              >
                <motion.img
                  src={`${import.meta.env.BASE_URL}images/delivery-truck.png`}
                  alt="G Trace delivery truck"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="w-full max-w-lg relative z-10"
                  style={{
                    filter: "drop-shadow(0 30px 60px rgba(59, 130, 246, 0.2)) drop-shadow(0 10px 30px rgba(0,0,0,0.15))",
                    transform: "scale(1.05)",
                  }}
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-slate-900/10 rounded-full blur-md" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── STATS BAR ───────────── */}
      <section className="bg-primary py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            {[
              { value: 190, suffix: "+", label: "Countries Covered" },
              { value: 2000000, suffix: "+", label: "Packages Tracked" },
              { value: 99, suffix: ".9%", label: "Uptime Guaranteed" },
              { value: 50, suffix: "+", label: "Major Ports" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="text-4xl lg:text-5xl font-display font-bold text-white mb-2">
                  <CountUp target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-blue-100 text-sm font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-4">
              How It Works
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
              Three steps to full visibility
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 text-lg max-w-xl mx-auto">
              Simple, fast, and globally reliable. From handover to delivery, every step is tracked.
            </motion.p>
          </AnimatedSection>

          <AnimatedSection className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Package className="w-8 h-8" />,
                step: "01",
                title: "Ship your package",
                desc: "Hand your shipment to any supported carrier — air, sea, or road. We connect to thousands of global logistics partners to receive your shipment data automatically.",
              },
              {
                icon: <Search className="w-8 h-8" />,
                step: "02",
                title: "Get your tracking ID",
                desc: "Receive a unique G Trace ID (format: GT-XXX-1234) tied to your shipment. Share it with your customer or use it yourself to monitor progress at any time.",
              },
              {
                icon: <Map className="w-8 h-8" />,
                step: "03",
                title: "Track in real time",
                desc: "Enter your ID on G Trace to see a live map, full event timeline, estimated arrival time, and all transit checkpoints — from anywhere in the world.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="relative bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute -top-4 -right-2 text-7xl font-display font-black text-slate-100 select-none leading-none">
                  {step.step}
                </div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                  {step.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ───────────── WORLD COVERAGE ───────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <AnimatedSection>
              <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-4">
                Worldwide Coverage
              </motion.span>
              <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-slate-900 leading-tight mb-6">
                Supporting every corner of the globe
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-600 text-lg leading-relaxed mb-5">
                From bustling megaports like Shanghai, Rotterdam, and Jebel Ali to remote landlocked destinations deep in Central Asia and sub-Saharan Africa — G Trace has you covered. Our tracking network spans every continent, supporting shipments via commercial airlines, cargo vessels, road freight, and rail networks.
              </motion.p>
              <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-5">
                Built for both enterprise logistics teams managing thousands of daily shipments and individuals sending a single parcel abroad, our platform scales to every need. All 195 UN-recognized countries are supported, with live data flowing from our carrier partners around the clock.
              </motion.p>
              <motion.p variants={fadeUp} className="text-slate-600 leading-relaxed mb-8">
                Special support for high-volume trade lanes: Trans-Pacific, Asia-Europe, and Transatlantic — with enhanced checkpoint density and carrier redundancy to ensure you never lose visibility.
              </motion.p>
              <motion.div variants={stagger} className="space-y-3">
                {[
                  { flag: "🌍", region: "Africa", detail: "54 countries, 6 major ports" },
                  { flag: "🌎", region: "Americas", detail: "35 countries, 12 major ports" },
                  { flag: "🌏", region: "Asia Pacific", detail: "48 countries, 20 major ports" },
                  { flag: "🇪🇺", region: "Europe", detail: "44 countries, 15 major ports" },
                  { flag: "🌐", region: "Middle East & South Asia", detail: "30 countries, 8 major ports" },
                ].map((r) => (
                  <motion.div key={r.region} variants={fadeUp} className="flex items-center gap-4 py-3 border-b border-slate-100">
                    <span className="text-2xl">{r.flag}</span>
                    <div>
                      <div className="font-semibold text-slate-800">{r.region}</div>
                      <div className="text-sm text-slate-500">{r.detail}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>

            <AnimatedSection>
              <motion.h3 variants={fadeUp} className="text-xl font-display font-bold text-slate-900 mb-6">Key Coverage Highlights</motion.h3>
              <div className="space-y-4">
                <motion.div variants={fadeUp}>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Major Seaports</div>
                  <div className="flex flex-wrap gap-2">
                    {["Shanghai", "Rotterdam", "Singapore", "Jebel Ali", "Ningbo", "Los Angeles", "Hamburg", "Antwerp", "Hong Kong", "Busan", "Mumbai", "Durban"].map(p => (
                      <span key={p} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-700">{p}</span>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Major Cargo Airports</div>
                  <div className="flex flex-wrap gap-2">
                    {["Hong Kong (HKG)", "Memphis (MEM)", "Shanghai (PVG)", "Dubai (DXB)", "Louisville (SDF)", "Incheon (ICN)", "Anchorage (ANC)", "Paris (CDG)", "Singapore (SIN)", "Tokyo (NRT)"].map(p => (
                      <span key={p} className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-sm text-blue-700">{p}</span>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} className="mt-6 p-5 bg-primary/5 border border-primary/10 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <GlobeIcon className="w-5 h-5 text-primary" />
                    <span className="font-bold text-slate-900">All 195 UN-Recognized Countries</span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    G Trace is the only tracking platform with verified coverage across every officially recognized nation — including island territories, landlocked states, and disputed regions.
                  </p>
                </motion.div>
                <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <Plane className="w-5 h-5" />, label: "Air Freight" },
                    { icon: <Ship className="w-5 h-5" />, label: "Sea Freight" },
                    { icon: <Truck className="w-5 h-5" />, label: "Road Freight" },
                  ].map(m => (
                    <div key={m.label} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <span className="text-primary">{m.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{m.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ───────────── FEATURE GRID ───────────── */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest text-primary uppercase mb-4">
              Platform Features
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
              Everything you need to track freight
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 text-lg max-w-xl mx-auto">
              Purpose-built for global logistics. No excess, no complexity — just clarity on where your shipment is.
            </motion.p>
          </AnimatedSection>

          <AnimatedSection className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ───────────── CTA FOOTER ───────────── */}
      <section className="bg-slate-900 py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Map className="w-8 h-8 text-primary" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
              Start tracking today
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg mb-10">
              Enter your tracking ID to get started — no account required.
            </motion.p>
            <motion.form
              variants={fadeUp}
              onSubmit={handleTrack}
              className="w-full max-w-lg mx-auto mb-6"
            >
              <div className="flex bg-white rounded-2xl p-2 border border-slate-200 shadow-lg">
                <div className="flex-1 flex items-center px-4">
                  <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                  <Input
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter your G Trace ID"
                    className="border-0 bg-transparent text-base focus-visible:ring-0 px-0 h-11 shadow-none placeholder:text-slate-400"
                  />
                </div>
                <Button type="submit" className="rounded-xl px-6 h-11 bg-primary hover:bg-primary/90 text-white font-semibold">
                  Track
                </Button>
              </div>
            </motion.form>
            <motion.p variants={fadeUp} className="text-slate-500 text-sm">
              © 2025 G Trace · Global Logistics Visibility Platform
            </motion.p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
