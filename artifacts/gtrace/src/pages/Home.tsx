import { useState, useRef, useEffect } from "react"
import { useLocation } from "wouter"
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  Search, Globe as GlobeIcon, Activity, Clock, Package,
  CheckCircle2, Map, Plane, Ship, Truck, ArrowRight,
  BarChart3, Route, Ruler, ClipboardList, CalendarClock, Layers,
  ChevronDown, Anchor, Container, Zap
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/Navbar"

/* ─── Animation presets ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
}
const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
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
    const duration = 2000
    const step = 16
    const increment = target / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setVal(target); clearInterval(timer) }
      else { setVal(Math.floor(start)) }
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

/* ─── Floating orbit icon ─── */
function OrbitIcon({ icon, radius, speed, startAngle, size = 40 }: {
  icon: React.ReactNode; radius: number; speed: number; startAngle: number; size?: number
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: size, height: size, left: "50%", top: "50%", marginLeft: -size / 2, marginTop: -size / 2 }}
      animate={{
        x: [
          Math.cos(startAngle) * radius,
          Math.cos(startAngle + Math.PI / 2) * radius,
          Math.cos(startAngle + Math.PI) * radius,
          Math.cos(startAngle + (3 * Math.PI) / 2) * radius,
          Math.cos(startAngle + 2 * Math.PI) * radius,
        ],
        y: [
          Math.sin(startAngle) * radius,
          Math.sin(startAngle + Math.PI / 2) * radius,
          Math.sin(startAngle + Math.PI) * radius,
          Math.sin(startAngle + (3 * Math.PI) / 2) * radius,
          Math.sin(startAngle + 2 * Math.PI) * radius,
        ],
      }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-full h-full rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-300/60 backdrop-blur-sm">
        {icon}
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [, setLocation] = useLocation()
  const [trackingId, setTrackingId] = useState("")
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingId.trim()) setLocation(`/track/${trackingId.trim()}`)
  }

  return (
    <div className="flex flex-col bg-slate-950 overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950">

        {/* Background grid */}
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
          }}
        />

        {/* Glow orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[800px] h-[800px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[100px] pointer-events-none" />

        {/* Orbit icons */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <OrbitIcon icon={<Plane className="w-4 h-4" />} radius={280} speed={18} startAngle={0} size={36} />
          <OrbitIcon icon={<Ship className="w-4 h-4" />} radius={360} speed={26} startAngle={Math.PI} size={38} />
          <OrbitIcon icon={<Truck className="w-4 h-4" />} radius={220} speed={14} startAngle={Math.PI / 3} size={34} />
          <OrbitIcon icon={<Package className="w-3 h-3" />} radius={440} speed={34} startAngle={Math.PI * 1.5} size={30} />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold tracking-widest uppercase backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Global Logistics Tracking Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold leading-[1.0] text-white mb-6"
          >
            Track your cargo,{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #6366f1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              anywhere.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-light"
          >
            Real-time global logistics visibility across air, sea, and land. One tracking ID — full visibility
            from departure to doorstep, across 190+ countries.
          </motion.p>

          <motion.form
            onSubmit={handleTrack}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42 }}
            className="w-full max-w-2xl mx-auto mb-12"
          >
            <div className="flex gap-0 bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10 shadow-2xl shadow-blue-900/30 ring-1 ring-white/5">
              <div className="flex-1 flex items-center px-5">
                <Search className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" />
                <Input
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Tracking ID (e.g. GT-ABC-1234)"
                  className="border-0 bg-transparent text-base focus-visible:ring-0 px-0 h-13 shadow-none placeholder:text-slate-500 text-white"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="rounded-xl px-8 h-13 font-semibold text-white shrink-0"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  boxShadow: "0 0 24px rgba(59,130,246,0.4)",
                }}
              >
                Track <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.form>

          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { icon: <GlobeIcon className="w-3.5 h-3.5" />, label: "190+ Countries" },
              { icon: <Activity className="w-3.5 h-3.5" />, label: "Real-time Tracking" },
              { icon: <Plane className="w-3.5 h-3.5" />, label: "Air · Sea · Land" },
              { icon: <Clock className="w-3.5 h-3.5" />, label: "24/7 Visibility" },
            ].map((p, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.08, duration: 0.5 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-slate-300 backdrop-blur-sm"
              >
                <span className="text-blue-400">{p.icon}</span> {p.label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-600 font-medium tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="text-slate-600"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ SEA PORT BANNER ═══════════════════ */}
      <section className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80&auto=format&fit=crop"
            alt="Workers at a busy sea port with cargo cranes"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(2,6,23,1) 0%, rgba(2,6,23,0.75) 40%, rgba(2,6,23,0.3) 70%, rgba(2,6,23,0.1) 100%)"
          }} />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-16">
          <AnimatedSection>
            <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
              Trusted at the world's busiest ports
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-5 max-w-3xl">
              Where the world's cargo moves, we're watching.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-300 text-lg max-w-xl leading-relaxed mb-8">
              From the cranes of Rotterdam to the docks of Shanghai — G-Trace provides visibility across every handover, every checkpoint, every mile.
            </motion.p>
            <motion.div variants={stagger} className="flex flex-wrap gap-6">
              {[
                { icon: <Anchor className="w-4 h-4" />, label: "50+ Major Seaports" },
                { icon: <Container className="w-4 h-4" />, label: "Container & Bulk Freight" },
                { icon: <Zap className="w-4 h-4" />, label: "Live Port Updates" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-center gap-2.5 text-slate-200 text-sm font-medium"
                >
                  <span className="text-blue-400">{item.icon}</span>
                  {item.label}
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════ TRUCK + TEXT ═══════════════════ */}
      <section className="bg-slate-900 py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Truck image — screen blend removes white background on dark bg */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={slideLeft}
              className="relative flex items-center justify-center order-2 lg:order-1"
            >
              {/* Glow behind truck */}
              <div className="absolute w-3/4 h-3/4 rounded-full bg-blue-600/15 blur-[80px]" />
              <div className="absolute w-1/2 h-1/2 rounded-full bg-cyan-400/10 blur-[50px] translate-x-12 -translate-y-6" />

              <motion.img
                src={`${import.meta.env.BASE_URL}images/delivery-truck.png`}
                alt="G-Trace delivery truck"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative z-10 w-full max-w-lg"
                style={{
                  mixBlendMode: "screen",
                  filter: "drop-shadow(0 20px 60px rgba(59,130,246,0.35)) drop-shadow(0 0 30px rgba(6,182,212,0.2))",
                }}
              />

              {/* Shadow under truck */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-blue-900/30 rounded-full blur-xl" />

              {/* Floating stat badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute top-4 right-4 lg:top-12 lg:-right-4 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 shadow-xl backdrop-blur-sm z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg leading-none">1,200+</div>
                    <div className="text-slate-400 text-xs mt-0.5">Active Routes</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute bottom-8 left-4 lg:bottom-16 lg:-left-6 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 shadow-xl backdrop-blur-sm z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <div>
                    <div className="text-white font-semibold text-sm">Live Tracking</div>
                    <div className="text-slate-400 text-xs">Updated just now</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={slideRight}
              className="order-1 lg:order-2"
            >
              <span className="inline-block text-xs font-bold tracking-widest text-blue-400 uppercase mb-4">
                Global Delivery Network
              </span>
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
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </motion.div>
                ))}
              </AnimatedSection>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 50%, #312e81 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            {[
              { value: 190, suffix: "+", label: "Countries Covered" },
              { value: 2000000, suffix: "+", label: "Packages Tracked" },
              { value: 99, suffix: ".9%", label: "Uptime Guaranteed" },
              { value: 50, suffix: "+", label: "Major Ports" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
              >
                <div className="text-4xl lg:text-5xl font-display font-bold text-white mb-2">
                  <CountUp target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-blue-200 text-sm font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PORT WORKERS PHOTO ═══════════════════ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1504890967-14addfd4f4b0?w=1920&q=80&auto=format&fit=crop"
            alt="Port workers managing cargo containers"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.75) 50%, rgba(2,6,23,0.4) 100%)"
          }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <AnimatedSection>
              <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest text-cyan-400 uppercase mb-4">
                On the ground
              </motion.span>
              <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-6">
                From the dock to the doorstep — every step tracked.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-300 text-lg leading-relaxed mb-8">
                Port workers, freight handlers, customs agents, last-mile couriers — the entire chain of custody captured in real time. G-Trace bridges the gap between the physical world of logistics and the digital clarity your business demands.
              </motion.p>
              <motion.div variants={stagger} className="grid grid-cols-3 gap-4">
                {[
                  { icon: <Anchor className="w-5 h-5" />, label: "Sea Freight" },
                  { icon: <Plane className="w-5 h-5" />, label: "Air Freight" },
                  { icon: <Truck className="w-5 h-5" />, label: "Road Freight" },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-center"
                  >
                    <span className="text-cyan-400">{m.icon}</span>
                    <span className="text-sm font-medium text-slate-200">{m.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="bg-slate-950 py-28">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest text-blue-400 uppercase mb-4">
              How It Works
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
              Three steps to full visibility
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 text-lg max-w-xl mx-auto">
              Simple, fast, and globally reliable. From handover to delivery, every step is tracked.
            </motion.p>
          </AnimatedSection>

          <AnimatedSection className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Package className="w-7 h-7" />,
                step: "01",
                title: "Ship your package",
                desc: "Hand your shipment to any supported carrier — air, sea, or road. We connect to thousands of global logistics partners to receive your shipment data automatically.",
              },
              {
                icon: <Search className="w-7 h-7" />,
                step: "02",
                title: "Get your tracking ID",
                desc: "Receive a unique G-Trace ID (format: GT-XXX-1234) tied to your shipment. Share it with your customer or use it yourself to monitor progress at any time.",
              },
              {
                icon: <Map className="w-7 h-7" />,
                step: "03",
                title: "Track in real time",
                desc: "Enter your ID on G-Trace to see a live map, full event timeline, estimated arrival time, and all transit checkpoints — from anywhere in the world.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="relative rounded-2xl p-8 overflow-hidden group"
                style={{
                  background: "linear-gradient(145deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.9) 100%)",
                  border: "1px solid rgba(59,130,246,0.12)",
                }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: "linear-gradient(145deg, rgba(59,130,246,0.06), transparent)" }}
                />
                <div className="absolute top-4 right-5 text-7xl font-display font-black text-slate-800/60 select-none leading-none">
                  {step.step}
                </div>
                <div className="w-13 h-13 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                  {step.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════ WORLD COVERAGE ═══════════════════ */}
      <section className="bg-slate-900 py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <AnimatedSection>
              <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest text-blue-400 uppercase mb-4">
                Worldwide Coverage
              </motion.span>
              <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-6">
                Supporting every corner of the globe
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-5">
                From bustling megaports like Shanghai, Rotterdam, and Jebel Ali to remote landlocked destinations deep in Central Asia — G-Trace has you covered across every continent.
              </motion.p>
              <motion.div variants={stagger} className="space-y-2">
                {[
                  { flag: "🌍", region: "Africa", detail: "54 countries, 6 major ports" },
                  { flag: "🌎", region: "Americas", detail: "35 countries, 12 major ports" },
                  { flag: "🌏", region: "Asia Pacific", detail: "48 countries, 20 major ports" },
                  { flag: "🇪🇺", region: "Europe", detail: "44 countries, 15 major ports" },
                  { flag: "🌐", region: "Middle East & South Asia", detail: "30 countries, 8 major ports" },
                ].map((r) => (
                  <motion.div
                    key={r.region}
                    variants={fadeUp}
                    className="flex items-center gap-4 py-3.5 border-b border-slate-800 group cursor-default"
                  >
                    <span className="text-2xl">{r.flag}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">{r.region}</div>
                      <div className="text-sm text-slate-500">{r.detail}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-colors" />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>

            <AnimatedSection className="space-y-5">
              <motion.h3 variants={fadeUp} className="text-xl font-display font-bold text-white mb-2">Key Coverage Highlights</motion.h3>
              <motion.div variants={fadeUp}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Major Seaports</div>
                <div className="flex flex-wrap gap-2">
                  {["Shanghai", "Rotterdam", "Singapore", "Jebel Ali", "Ningbo", "Los Angeles", "Hamburg", "Antwerp", "Hong Kong", "Busan", "Mumbai", "Durban"].map(p => (
                    <span key={p} className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300 hover:border-blue-500/50 hover:text-blue-300 transition-colors cursor-default">{p}</span>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={fadeUp}>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Major Cargo Airports</div>
                <div className="flex flex-wrap gap-2">
                  {["Hong Kong (HKG)", "Memphis (MEM)", "Shanghai (PVG)", "Dubai (DXB)", "Louisville (SDF)", "Incheon (ICN)", "Paris (CDG)", "Singapore (SIN)", "Tokyo (NRT)"].map(p => (
                    <span key={p} className="px-3 py-1.5 bg-blue-950/60 border border-blue-900/60 rounded-full text-sm text-blue-300 hover:border-blue-500/60 transition-colors cursor-default">{p}</span>
                  ))}
                </div>
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="p-6 rounded-2xl border border-blue-500/20"
                style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.06))" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <GlobeIcon className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-white">All 195 UN-Recognized Countries</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  G-Trace is the only tracking platform with verified coverage across every officially recognized nation — including island territories, landlocked states, and disputed regions.
                </p>
              </motion.div>
              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
                {[
                  { icon: <Plane className="w-5 h-5" />, label: "Air Freight" },
                  { icon: <Ship className="w-5 h-5" />, label: "Sea Freight" },
                  { icon: <Truck className="w-5 h-5" />, label: "Road Freight" },
                ].map(m => (
                  <div
                    key={m.label}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-800 bg-slate-800/40 text-center hover:border-blue-500/40 transition-colors"
                  >
                    <span className="text-blue-400">{m.icon}</span>
                    <span className="text-xs font-medium text-slate-300">{m.label}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURE GRID ═══════════════════ */}
      <section className="bg-slate-950 py-28">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <motion.span variants={fadeUp} className="inline-block text-xs font-bold tracking-widest text-blue-400 uppercase mb-4">
              Platform Features
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
              Everything you need to track freight
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 text-lg max-w-xl mx-auto">
              Purpose-built for global logistics. No excess, no complexity — just clarity on where your shipment is.
            </motion.p>
          </AnimatedSection>

          <AnimatedSection className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-2xl p-7 group cursor-default transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(145deg, rgba(30,41,59,0.6) 0%, rgba(15,23,42,0.8) 100%)",
                  border: "1px solid rgba(51,65,85,0.8)",
                }}
                whileHover={{ borderColor: "rgba(59,130,246,0.3)" }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:bg-blue-500/20 transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&q=80&auto=format&fit=crop"
            alt="Cargo ship at sunset in a major port"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.7) 50%, rgba(2,6,23,0.9) 100%)"
          }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="w-16 h-16 rounded-2xl border border-blue-500/30 bg-blue-500/15 flex items-center justify-center mx-auto mb-6">
              <Map className="w-8 h-8 text-blue-400" />
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
              <div className="flex bg-white/8 backdrop-blur-md rounded-2xl p-2 border border-white/15 shadow-2xl shadow-blue-900/30">
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
                  className="rounded-xl px-6 h-11 font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
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
