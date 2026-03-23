"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import {
  Search, Globe as GlobeIcon, Activity, Clock, Package,
  CheckCircle2, Map, Plane, Ship, Truck, ArrowRight,
  BarChart3, Route, Ruler, ClipboardList, CalendarClock, Layers,
  ChevronDown, Anchor, Zap, Satellite, MapPin
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import dynamic from "next/dynamic";

const HomeMap = dynamic(() => import("@/components/HomeMap"), { ssr: false });

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const slideLeft = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.72, ease: EASE } },
};
const slideRight = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.72, ease: EASE } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.62, ease: EASE } },
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

const FEATURES = [
  { icon: <BarChart3 className="w-5 h-5" />, title: "Real-time Location", desc: "See exactly where your shipment is at any moment with live GPS coordinates and map pins." },
  { icon: <Route className="w-5 h-5" />, title: "Route Visualization", desc: "Interactive maps show the full journey from origin to destination with animated paths." },
  { icon: <Ruler className="w-5 h-5" />, title: "Distance Tracking", desc: "Know exactly how far your package has traveled and how far it still needs to go." },
  { icon: <ClipboardList className="w-5 h-5" />, title: "Delivery Timeline", desc: "Full event history with timestamps, location notes, and carrier status updates." },
  { icon: <CalendarClock className="w-5 h-5" />, title: "Schedule Updates", desc: "Plan ahead with automated location update scheduling for predictable arrivals." },
  { icon: <Layers className="w-5 h-5" />, title: "Multi-modal Support", desc: "Air, sea, road, and rail — all tracking modes unified in one dashboard." },
];

export default function Home() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) router.push(`/track/${trackingId.trim()}`);
  };

  return (
    <div className="flex flex-col bg-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HomeMap />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.82) 55%, rgba(255,255,255,0.97) 100%)"
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-slate-200 bg-white text-slate-600 text-xs font-semibold tracking-widest uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Global Logistics Tracking Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.14, ease: EASE }}
            className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold leading-[1.0] text-slate-900 mb-6"
          >
            Track your cargo,{" "}
            <span className="text-blue-700">anywhere.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.28 }}
            className="text-lg sm:text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-light"
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
            <div className="flex bg-white rounded-2xl p-2 border border-slate-200 shadow-lg shadow-slate-200/60">
              <div className="flex-1 flex items-center px-4">
                <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                <Input
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter Tracking ID  (e.g. GT-ABC-1234)"
                  className="border-0 bg-transparent text-base focus-visible:ring-0 px-0 h-13 shadow-none placeholder:text-slate-400 text-slate-900"
                />
              </div>
              <Button type="submit" size="lg" className="rounded-xl px-8 h-13 font-semibold text-white shrink-0 bg-blue-700 hover:bg-blue-600">
                Track <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.form>

          <motion.div className="flex flex-wrap justify-center gap-3" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }}>
            {[
              { icon: <GlobeIcon className="w-3.5 h-3.5" />, label: "190+ Countries" },
              { icon: <Activity className="w-3.5 h-3.5" />, label: "Real-time Tracking" },
              { icon: <Plane className="w-3.5 h-3.5" />, label: "Air · Sea · Land" },
              { icon: <Clock className="w-3.5 h-3.5" />, label: "24/7 Visibility" },
            ].map((p, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 + i * 0.07 }} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 shadow-sm">
                <span className="text-blue-600">{p.icon}</span> {p.label}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-xs text-slate-400 font-medium tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </section>

      {/* PORT BANNER */}
      <section className="relative h-[65vh] min-h-[440px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80&auto=format&fit=crop" alt="Container port with cargo cranes" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,15,26,1) 0%, rgba(10,15,26,0.65) 45%, rgba(10,15,26,0.1) 100%)" }} />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-14">
          <AnimatedSection>
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">Trusted at the world&apos;s busiest ports</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-5 max-w-3xl">Where the world&apos;s cargo moves, we&apos;re watching.</motion.h2>
            <motion.div variants={stagger} className="flex flex-wrap gap-6">
              {[{ icon: <Anchor className="w-4 h-4" />, label: "50+ Major Seaports" }, { icon: <Package className="w-4 h-4" />, label: "Container & Bulk Freight" }, { icon: <Zap className="w-4 h-4" />, label: "Live Port Updates" }].map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                  <span className="text-slate-400">{item.icon}</span>{item.label}
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* TRUCK + TEXT */}
      <section className="bg-slate-50 py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={slideLeft} className="relative rounded-2xl overflow-hidden order-2 lg:order-1 shadow-xl" style={{ minHeight: 380 }}>
              <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=80&auto=format&fit=crop" alt="Freight truck on the road" className="w-full h-full object-cover" style={{ minHeight: 380 }} />
              <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.45 }} className="absolute bottom-5 left-5 bg-white/95 border border-slate-200 rounded-xl px-5 py-3 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div>
                    <div className="text-slate-900 font-semibold text-sm">Live Tracking Active</div>
                    <div className="text-slate-500 text-xs">1,200+ routes monitored</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={slideRight} className="order-1 lg:order-2">
              <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Global Delivery Network</p>
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 leading-tight mb-6">Built for every delivery,<br /><span className="text-slate-500">everywhere.</span></h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-5">From bustling megaports in Shanghai and Rotterdam to quiet neighborhoods in rural Africa — G-Trace powers visibility across every mile of the journey.</p>
              <p className="text-slate-500 leading-relaxed mb-8">Whether your cargo is crossing the Pacific in a container ship, cruising at 35,000 feet, or loaded on a delivery van three blocks away — G-Trace knows exactly where it is, and when it will arrive.</p>
              <AnimatedSection className="space-y-3">
                {["190+ countries and territories covered", "Air, sea, road, and rail freight supported", "Real-time GPS and carrier API integration", "Automated event updates at every checkpoint", "Multi-modal handover tracking", "24/7 monitoring with instant alert delivery"].map((item) => (
                  <motion.div key={item} variants={fadeUp} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </motion.div>
                ))}
              </AnimatedSection>
            </motion.div>
          </div>
        </div>
      </section>

      {/* EARTH / SATELLITE */}
      <section className="bg-white py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Satellite-level visibility</motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-slate-900 leading-tight mb-6">Every shipment. Every continent. One platform.</motion.h2>
              <motion.p variants={fadeUp} className="text-slate-600 text-lg leading-relaxed mb-5">Our global tracking infrastructure spans every continent and ocean.</motion.p>
              <motion.p variants={fadeUp} className="text-slate-500 leading-relaxed mb-8">With carrier integrations across hundreds of airlines, shipping lines, and road freight operators, data flows in continuously.</motion.p>
              <motion.div variants={stagger} className="grid grid-cols-3 gap-3">
                {[{ icon: <Satellite className="w-5 h-5" />, label: "Satellite Data" }, { icon: <MapPin className="w-5 h-5" />, label: "Live Pins" }, { icon: <GlobeIcon className="w-5 h-5" />, label: "195 Nations" }].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex flex-col items-center gap-2 py-5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-center">
                    <span className="text-slate-500">{item.icon}</span>
                    <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={scaleIn} className="relative flex items-center justify-center">
              <div className="relative w-full max-w-[460px] aspect-square rounded-full overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/80">
                <img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1000&q=80&auto=format&fit=crop" alt="Earth from space" className="w-full h-full object-cover" />
              </div>
              <motion.div initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.45 }} className="absolute top-8 -right-2 lg:right-2 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2.5"><Satellite className="w-4 h-4 text-slate-500" /><div><div className="text-slate-900 font-semibold text-sm">190+ Countries</div><div className="text-slate-400 text-xs">Active coverage</div></div></div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="absolute bottom-10 -left-2 lg:left-2 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><div><div className="text-slate-900 font-semibold text-sm">Real-time Updates</div><div className="text-slate-400 text-xs">Every checkpoint</div></div></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PORT WORKERS */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1920&q=80&auto=format&fit=crop" alt="Workers managing cargo containers" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,15,26,0.93) 0%, rgba(10,15,26,0.7) 52%, rgba(10,15,26,0.28) 100%)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl">
            <AnimatedSection>
              <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">On the ground</motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-6">From the dock to the doorstep — every step tracked.</motion.h2>
              <motion.p variants={fadeUp} className="text-slate-300 text-lg leading-relaxed mb-8">Port workers, freight handlers, customs agents, last-mile couriers — the entire chain of custody captured in real time.</motion.p>
              <motion.div variants={stagger} className="flex flex-wrap gap-3">
                {[{ icon: <Anchor className="w-4 h-4" />, label: "Sea Freight" }, { icon: <Plane className="w-4 h-4" />, label: "Air Freight" }, { icon: <Truck className="w-4 h-4" />, label: "Road Freight" }].map((m, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-2 py-2.5 px-4 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm">
                    <span className="text-slate-300">{m.icon}</span>
                    <span className="text-sm font-medium text-white">{m.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-50 py-28">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">How It Works</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">Three steps to full visibility</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 text-lg max-w-xl mx-auto">Simple, fast, and globally reliable.</motion.p>
          </AnimatedSection>
          <AnimatedSection className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Package className="w-6 h-6" />, step: "01", title: "Ship your package", desc: "Hand your shipment to any supported carrier — air, sea, or road.", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=75&auto=format&fit=crop" },
              { icon: <Search className="w-6 h-6" />, step: "02", title: "Get your tracking ID", desc: "Receive a unique G-Trace ID (format: GT-XXX-1234) tied to your shipment.", img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=75&auto=format&fit=crop" },
              { icon: <Map className="w-6 h-6" />, step: "03", title: "Track in real time", desc: "Enter your ID on G-Trace to see a live map, full event timeline, and all transit checkpoints.", img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=75&auto=format&fit=crop" },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-44 overflow-hidden">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.5) 100%)" }} />
                  <div className="absolute bottom-3 right-3 text-5xl font-display font-black text-white/20 leading-none select-none">{step.step}</div>
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">{step.icon}</div>
                  <h3 className="font-display font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-28">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Platform Features</motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">Everything you need to track, nothing you don&apos;t.</motion.h2>
          </AnimatedSection>
          <AnimatedSection className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-4 shadow-sm">{f.icon}</div>
                <h3 className="font-display font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-display font-bold text-white mb-6">Ready to track your first shipment?</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg mb-10">Enter your tracking ID and get real-time visibility in seconds.</motion.p>
            <motion.div variants={fadeUp}>
              <Button onClick={() => router.push("/track")} size="lg" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-6 text-lg font-semibold rounded-xl gap-3">
                Start Tracking <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center"><Map className="w-4 h-4 text-white" /></div>
            <span className="font-display font-bold text-white">G-Trace</span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} G-Trace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
