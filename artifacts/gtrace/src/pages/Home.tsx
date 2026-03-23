import { useState, useRef } from "react"
import { useLocation } from "wouter"
import { motion, useInView } from "framer-motion"
import {
  Search, Globe as GlobeIcon, Activity, Clock, Package,
  CheckCircle2, Map, Plane, Ship, Truck, ArrowRight,
  BarChart3, Route, Ruler, ClipboardList, CalendarClock, Layers,
  ChevronDown, Anchor, Zap, Satellite, MapPin
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/Navbar"
import { MapContainer, TileLayer } from "react-leaflet"

/* ─── Animation presets (entry only) ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const slideLeft = {
  hidden: { opacity: 0, x: -52 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const slideRight = {
  hidden: { opacity: 0, x: 52 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } },
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-70px" })
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  )
}

const FEATURES = [
  { icon: <BarChart3 className="w-5 h-5" />, title: "Real-time Location", desc: "See exactly where your shipment is at any moment with live GPS coordinates and map pins." },
  { icon: <Route className="w-5 h-5" />, title: "Route Visualization", desc: "Interactive maps show the full journey from origin to destination with animated paths." },
  { icon: <Ruler className="w-5 h-5" />, title: "Distance Tracking", desc: "Know exactly how far your package has traveled and how far it still needs to go." },
  { icon: <ClipboardList className="w-5 h-5" />, title: "Delivery Timeline", desc: "Full event history with timestamps, location notes, and carrier status updates." },
  { icon: <CalendarClock className="w-5 h-5" />, title: "Schedule Updates", desc: "Plan ahead with automated location update scheduling for predictable arrivals." },
  { icon: <Layers className="w-5 h-5" />, title: "Multi-modal Support", desc: "Air, sea, road, and rail — all tracking modes unified in one dashboard." },
]

export default function Home() {
  const [, setLocation] = useLocation()
  const [trackingId, setTrackingId] = useState("")

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingId.trim()) setLocation(`/track/${trackingId.trim()}`)
  }

  return (
    <div className="flex flex-col bg-[#0a0f1a] overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO — dark map ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MapContainer
            center={[20, 10]}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          </MapContainer>
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, rgba(10,15,26,0.5) 0%, rgba(10,15,26,0.82) 55%, rgba(10,15,26,0.97) 100%)"
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/15 bg-white/6 text-slate-300 text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              Global Logistics Tracking Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.14, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold leading-[1.0] text-white mb-6"
          >
            Track your cargo,{" "}
            <span className="text-white/70">anywhere.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.28 }}
            className="text-lg sm:text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-light"
          >
            Real-time global logistics visibility across air, sea, and land. One tracking ID — full visibility
            from departure to doorstep, across 190+ countries.
          </motion.p>

          <motion.form
            onSubmit={handleTrack}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.4 }}
            className="w-full max-w-2xl mx-auto mb-12"
          >
            <div className="flex bg-white/8 backdrop-blur-xl rounded-2xl p-2 border border-white/12">
              <div className="flex-1 flex items-center px-5">
                <Search className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" />
                <Input
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Tracking ID  (e.g. GT-ABC-1234)"
                  className="border-0 bg-transparent text-base focus-visible:ring-0 px-0 h-13 shadow-none placeholder:text-slate-500 text-white"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="rounded-xl px-8 h-13 font-semibold text-white shrink-0 bg-blue-700 hover:bg-blue-600"
              >
                Track <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.form>

          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56, duration: 0.6 }}
          >
            {[
              { icon: <GlobeIcon className="w-3.5 h-3.5" />, label: "190+ Countries" },
              { icon: <Activity className="w-3.5 h-3.5" />, label: "Real-time Tracking" },
              { icon: <Plane className="w-3.5 h-3.5" />, label: "Air · Sea · Land" },
              { icon: <Clock className="w-3.5 h-3.5" />, label: "24/7 Visibility" },
            ].map((p, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.07 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-slate-400 backdrop-blur-sm"
              >
                <span className="text-slate-300">{p.icon}</span> {p.label}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/25 font-medium tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 text-white/25" />
        </motion.div>
      </section>

      {/* ═══ PORT BANNER ═══ */}
      <section className="relative h-[65vh] min-h-[440px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80&auto=format&fit=crop"
            alt="Container port with large cargo cranes"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(10,15,26,1) 0%, rgba(10,15,26,0.65) 45%, rgba(10,15,26,0.1) 100%)"
          }} />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-14">
          <AnimatedSection>
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">
              Trusted at the world's busiest ports
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-5 max-w-3xl">
              Where the world's cargo moves, we're watching.
            </motion.h2>
            <motion.div variants={stagger} className="flex flex-wrap gap-6">
              {[
                { icon: <Anchor className="w-4 h-4" />, label: "50+ Major Seaports" },
                { icon: <Package className="w-4 h-4" />, label: "Container & Bulk Freight" },
                { icon: <Zap className="w-4 h-4" />, label: "Live Port Updates" },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                  <span className="text-slate-400">{item.icon}</span>
                  {item.label}
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ TRUCK + TEXT ═══ */}
      <section className="bg-[#0d1424] py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={slideLeft}
              className="relative rounded-2xl overflow-hidden order-2 lg:order-1"
              style={{ minHeight: 380 }}
            >
              <img
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=80&auto=format&fit=crop"
                alt="Freight truck on the road"
                className="w-full h-full object-cover"
                style={{ minHeight: 380 }}
              />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(135deg, rgba(10,15,26,0.3) 0%, transparent 60%)"
              }} />
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45 }}
                className="absolute bottom-5 left-5 bg-[#0a0f1a]/92 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div>
                    <div className="text-white font-semibold text-sm">Live Tracking Active</div>
                    <div className="text-slate-400 text-xs">1,200+ routes monitored</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={slideRight}
              className="order-1 lg:order-2"
            >
              <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Global Delivery Network</p>
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-6">
                Built for every delivery,
                <br />
                <span className="text-slate-400">everywhere.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-5">
                From bustling megaports in Shanghai and Rotterdam to quiet neighborhoods in rural Africa — G-Trace powers visibility across every mile of the journey. Thousands of carriers, freight forwarders, and last-mile couriers unified under one tracking system.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                Whether your cargo is crossing the Pacific in a container ship, cruising at 35,000 feet, or loaded on a delivery van three blocks away — G-Trace knows exactly where it is, and when it will arrive.
              </p>
              <AnimatedSection className="space-y-3">
                {[
                  "190+ countries and territories covered",
                  "Air, sea, road, and rail freight supported",
                  "Real-time GPS and carrier API integration",
                  "Automated event updates at every checkpoint",
                  "Multi-modal handover tracking",
                  "24/7 monitoring with instant alert delivery",
                ].map((item) => (
                  <motion.div key={item} variants={fadeUp} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </motion.div>
                ))}
              </AnimatedSection>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ EARTH / SATELLITE ═══ */}
      <section className="bg-[#0a0f1a] py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
                Satellite-level visibility
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-6">
                Every shipment. Every continent. One platform.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-5">
                Our global tracking infrastructure spans every continent and ocean. G-Trace gives you a clear perspective on your cargo — wherever it is in the world, at any moment in time.
              </motion.p>
              <motion.p variants={fadeUp} className="text-slate-500 leading-relaxed mb-8">
                With carrier integrations across hundreds of airlines, shipping lines, and road freight operators, data flows in continuously — so you're always looking at the freshest location.
              </motion.p>
              <motion.div variants={stagger} className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Satellite className="w-5 h-5" />, label: "Satellite Data" },
                  { icon: <MapPin className="w-5 h-5" />, label: "Live Pins" },
                  { icon: <GlobeIcon className="w-5 h-5" />, label: "195 Nations" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="flex flex-col items-center gap-2 py-5 px-3 rounded-xl border border-white/8 bg-white/4 text-center"
                  >
                    <span className="text-slate-300">{item.icon}</span>
                    <span className="text-xs font-medium text-slate-400">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={scaleIn}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-[460px] aspect-square rounded-full overflow-hidden border border-white/12 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1000&q=80&auto=format&fit=crop"
                  alt="Earth from space — satellite view"
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45 }}
                className="absolute top-8 -right-2 lg:right-2 bg-[#0a0f1a]/95 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-md"
              >
                <div className="flex items-center gap-2.5">
                  <Satellite className="w-4 h-4 text-slate-300" />
                  <div>
                    <div className="text-white font-semibold text-sm">190+ Countries</div>
                    <div className="text-slate-500 text-xs">Active coverage</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-10 -left-2 lg:left-2 bg-[#0a0f1a]/95 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-md"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div>
                    <div className="text-white font-semibold text-sm">Real-time Updates</div>
                    <div className="text-slate-500 text-xs">Every checkpoint</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ PORT WORKERS PHOTO ═══ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504890967-14addfd4f4b0?w=1920&q=80&auto=format&fit=crop"
            alt="Workers managing cargo containers at a busy seaport"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, rgba(10,15,26,0.95) 0%, rgba(10,15,26,0.72) 52%, rgba(10,15,26,0.3) 100%)"
          }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl">
            <AnimatedSection>
              <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
                On the ground
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-6">
                From the dock to the doorstep — every step tracked.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-300 text-lg leading-relaxed mb-8">
                Port workers, freight handlers, customs agents, last-mile couriers — the entire chain of custody captured in real time. G-Trace bridges the gap between the physical world of logistics and the digital clarity your business demands.
              </motion.p>
              <motion.div variants={stagger} className="flex flex-wrap gap-3">
                {[
                  { icon: <Anchor className="w-4 h-4" />, label: "Sea Freight" },
                  { icon: <Plane className="w-4 h-4" />, label: "Air Freight" },
                  { icon: <Truck className="w-4 h-4" />, label: "Road Freight" },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="flex items-center gap-2 py-2.5 px-4 rounded-lg border border-white/12 bg-white/6 backdrop-blur-sm"
                  >
                    <span className="text-slate-300">{m.icon}</span>
                    <span className="text-sm font-medium text-slate-200">{m.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="bg-[#0d1424] py-28">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
              How It Works
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
              Three steps to full visibility
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 text-lg max-w-xl mx-auto">
              Simple, fast, and globally reliable. From handover to delivery, every step is tracked.
            </motion.p>
          </AnimatedSection>

          <AnimatedSection className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: <Package className="w-6 h-6" />,
                step: "01",
                title: "Ship your package",
                desc: "Hand your shipment to any supported carrier — air, sea, or road. We connect to thousands of global logistics partners automatically.",
                img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=75&auto=format&fit=crop",
              },
              {
                icon: <Search className="w-6 h-6" />,
                step: "02",
                title: "Get your tracking ID",
                desc: "Receive a unique G-Trace ID (format: GT-XXX-1234) tied to your shipment. Share it with your customer or monitor it yourself.",
                img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=75&auto=format&fit=crop",
              },
              {
                icon: <Map className="w-6 h-6" />,
                step: "03",
                title: "Track in real time",
                desc: "Enter your ID on G-Trace to see a live map, full event timeline, and all transit checkpoints — from anywhere in the world.",
                img: "https://images.unsplash.com/photo-1611174243003-d78abb98c6e4?w=600&q=75&auto=format&fit=crop",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-2xl overflow-hidden border border-white/8 bg-[#0a0f1a]"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(to bottom, rgba(10,15,26,0.05) 0%, rgba(10,15,26,0.75) 100%)"
                  }} />
                  <div className="absolute bottom-3 right-3 text-5xl font-display font-black text-white/12 leading-none select-none">
                    {step.step}
                  </div>
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/6 flex items-center justify-center text-slate-300 mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-display font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ AIR FREIGHT BANNER ═══ */}
      <section className="relative h-[48vh] min-h-[340px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=1920&q=80&auto=format&fit=crop"
            alt="Cargo aircraft on the tarmac"
            className="w-full h-full object-cover object-bottom"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, rgba(10,15,26,0.92) 0%, rgba(10,15,26,0.55) 50%, rgba(10,15,26,0.18) 100%)"
          }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <AnimatedSection>
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">
              Air Freight
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-display font-bold text-white mb-3 max-w-lg">
              Airborne cargo tracked from takeoff to touchdown.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-base max-w-md">
              Real-time flight status integration with 500+ airlines and cargo carriers worldwide.
            </motion.p>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ WORLD COVERAGE ═══ */}
      <section className="bg-[#0a0f1a] py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <AnimatedSection>
              <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
                Worldwide Coverage
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-6">
                Supporting every corner of the globe
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-5">
                From megaports like Shanghai, Rotterdam, and Jebel Ali to remote landlocked destinations in Central Asia — G-Trace has you covered across every continent.
              </motion.p>
              <motion.div variants={stagger} className="space-y-0">
                {[
                  { flag: "🌍", region: "Africa", detail: "54 countries, 6 major ports" },
                  { flag: "🌎", region: "Americas", detail: "35 countries, 12 major ports" },
                  { flag: "🌏", region: "Asia Pacific", detail: "48 countries, 20 major ports" },
                  { flag: "🇪🇺", region: "Europe", detail: "44 countries, 15 major ports" },
                  { flag: "🌐", region: "Middle East & South Asia", detail: "30 countries, 8 major ports" },
                ].map((r) => (
                  <motion.div key={r.region} variants={fadeUp} className="flex items-center gap-4 py-4 border-b border-white/6">
                    <span className="text-2xl">{r.flag}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-200">{r.region}</div>
                      <div className="text-sm text-slate-500">{r.detail}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-700" />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>

            <AnimatedSection className="space-y-5">
              <motion.div variants={scaleIn} className="rounded-2xl overflow-hidden border border-white/6">
                <img
                  src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80&auto=format&fit=crop"
                  alt="Aerial view of a global city"
                  className="w-full h-52 object-cover"
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Major Seaports</p>
                <div className="flex flex-wrap gap-2">
                  {["Shanghai", "Rotterdam", "Singapore", "Jebel Ali", "Ningbo", "Los Angeles", "Hamburg", "Antwerp", "Hong Kong", "Busan", "Mumbai", "Durban"].map(p => (
                    <span key={p} className="px-3 py-1.5 bg-white/4 border border-white/8 rounded-full text-sm text-slate-400 hover:text-white hover:border-white/20 transition-colors cursor-default">{p}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Major Cargo Airports</p>
                <div className="flex flex-wrap gap-2">
                  {["Hong Kong (HKG)", "Memphis (MEM)", "Shanghai (PVG)", "Dubai (DXB)", "Louisville (SDF)", "Incheon (ICN)", "Paris (CDG)", "Singapore (SIN)"].map(p => (
                    <span key={p} className="px-3 py-1.5 bg-white/4 border border-white/8 rounded-full text-sm text-slate-400 hover:text-white hover:border-white/20 transition-colors cursor-default">{p}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="p-5 rounded-xl border border-white/8 bg-white/3">
                <div className="flex items-center gap-3 mb-2">
                  <GlobeIcon className="w-4 h-4 text-slate-300" />
                  <span className="font-semibold text-white text-sm">All 195 UN-Recognized Countries</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  The only tracking platform with verified coverage across every officially recognized nation — including island territories, landlocked states, and disputed regions.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Plane className="w-4 h-4" />, label: "Air Freight" },
                  { icon: <Ship className="w-4 h-4" />, label: "Sea Freight" },
                  { icon: <Truck className="w-4 h-4" />, label: "Road Freight" },
                ].map(m => (
                  <div key={m.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/8 bg-white/3 text-center">
                    <span className="text-slate-400">{m.icon}</span>
                    <span className="text-xs font-medium text-slate-400">{m.label}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="bg-[#0d1424] py-28">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
              Platform Features
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
              Everything you need to track freight
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 text-lg max-w-xl mx-auto">
              Purpose-built for global logistics. No excess, no complexity — just clarity on where your shipment is.
            </motion.p>
          </AnimatedSection>

          <AnimatedSection className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-xl p-6 border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/14 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 mb-5">
                  {f.icon}
                </div>
                <h3 className="text-base font-display font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ IMAGE STRIP ═══ */}
      <section className="grid grid-cols-1 md:grid-cols-3 h-64">
        {[
          {
            src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=75&auto=format&fit=crop",
            label: "Warehousing",
          },
          {
            src: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=75&auto=format&fit=crop",
            label: "Last-mile Delivery",
          },
          {
            src: "https://images.unsplash.com/photo-1611174243003-d78abb98c6e4?w=800&q=75&auto=format&fit=crop",
            label: "Customs Clearance",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="relative overflow-hidden group"
          >
            <img
              src={item.src}
              alt={item.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(to top, rgba(10,15,26,0.9) 0%, rgba(10,15,26,0.2) 55%)"
            }} />
            <div className="absolute bottom-4 left-4">
              <span className="text-white font-display font-semibold text-base">{item.label}</span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&q=80&auto=format&fit=crop"
            alt="Cargo ship at a major port"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(10,15,26,0.9) 0%, rgba(10,15,26,0.75) 50%, rgba(10,15,26,0.92) 100%)"
          }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="w-14 h-14 rounded-xl border border-white/12 bg-white/6 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Map className="w-7 h-7 text-slate-300" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
              Start tracking today
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg mb-10">
              Enter your tracking ID to get started — no account required.
            </motion.p>
            <motion.form variants={fadeUp} onSubmit={handleTrack} className="w-full max-w-lg mx-auto mb-6">
              <div className="flex bg-white/8 backdrop-blur-xl rounded-2xl p-2 border border-white/12">
                <div className="flex-1 flex items-center px-4">
                  <Search className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" />
                  <Input
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter your G-Trace ID"
                    className="border-0 bg-transparent text-base focus-visible:ring-0 px-0 h-11 shadow-none placeholder:text-slate-500 text-white"
                  />
                </div>
                <Button
                  type="submit"
                  className="rounded-xl px-6 h-11 font-semibold text-white bg-blue-700 hover:bg-blue-600"
                >
                  Track
                </Button>
              </div>
            </motion.form>
            <motion.p variants={fadeUp} className="text-slate-600 text-sm">
              © 2025 G-Trace · Global Logistics Visibility Platform
            </motion.p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
