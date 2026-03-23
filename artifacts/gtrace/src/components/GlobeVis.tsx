import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function GlobeVis() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const resize = () => {
      const size = Math.min(canvas.parentElement?.offsetWidth ?? 500, 550);
      canvas.width = size;
      canvas.height = size;
    };

    resize();
    window.addEventListener("resize", resize);

    const landMasses = [
      // North America
      { lat: 40, lng: -100, size: 55 },
      { lat: 60, lng: -120, size: 40 },
      { lat: 25, lng: -90, size: 35 },
      // South America
      { lat: -15, lng: -60, size: 45 },
      { lat: -40, lng: -65, size: 30 },
      // Europe
      { lat: 50, lng: 15, size: 30 },
      { lat: 60, lng: 25, size: 25 },
      // Africa
      { lat: 5, lng: 22, size: 55 },
      { lat: -25, lng: 25, size: 35 },
      // Asia
      { lat: 55, lng: 90, size: 75 },
      { lat: 35, lng: 100, size: 50 },
      { lat: 25, lng: 80, size: 40 },
      { lat: 10, lng: 105, size: 30 },
      // Australia
      { lat: -25, lng: 135, size: 40 },
      // Greenland
      { lat: 72, lng: -45, size: 30 },
    ];

    const latLngToXY = (lat: number, lng: number, r: number, cx: number, cy: number, rotation: number) => {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lng + rotation) * Math.PI) / 180;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      return { x: cx + x, y: cy - y, z };
    };

    const drawFrame = () => {
      const { width, height } = canvas;
      const cx = width / 2;
      const cy = height / 2;
      const r = width * 0.42;

      ctx.clearRect(0, 0, width, height);

      // Outer glow
      const outerGlow = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.3);
      outerGlow.addColorStop(0, "rgba(0, 183, 255, 0.08)");
      outerGlow.addColorStop(1, "rgba(0, 183, 255, 0)");
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Atmosphere ring
      const atmGradient = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.15);
      atmGradient.addColorStop(0, "rgba(0, 183, 255, 0.12)");
      atmGradient.addColorStop(0.5, "rgba(0, 183, 255, 0.04)");
      atmGradient.addColorStop(1, "rgba(0, 183, 255, 0)");
      ctx.fillStyle = atmGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Globe base
      const globeGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
      globeGrad.addColorStop(0, "hsl(220, 45%, 14%)");
      globeGrad.addColorStop(0.5, "hsl(220, 45%, 8%)");
      globeGrad.addColorStop(1, "hsl(220, 45%, 4%)");
      ctx.fillStyle = globeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Lat lines (parallels)
      ctx.strokeStyle = "rgba(0, 183, 255, 0.06)";
      ctx.lineWidth = 0.5;
      for (let lat = -75; lat <= 75; lat += 30) {
        const phi = ((90 - lat) * Math.PI) / 180;
        const ry = Math.cos(phi) * r;
        const rx = Math.sin(phi) * r;
        if (rx > 0) {
          ctx.beginPath();
          ctx.ellipse(cx, cy - Math.cos(phi) * r, rx, Math.abs(ry * 0.15), 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Meridian lines (longitude)
      ctx.strokeStyle = "rgba(0, 183, 255, 0.05)";
      for (let lng = 0; lng < 360; lng += 30) {
        const thetaA = ((lng + angle) * Math.PI) / 180;
        const cosT = Math.cos(thetaA);
        const startX = cx + r * Math.sin(0) * cosT;
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 3) {
          const phi = ((90 - lat) * Math.PI) / 180;
          const theta = ((lng + angle) * Math.PI) / 180;
          const xp = cx + r * Math.sin(phi) * Math.cos(theta);
          const yp = cy - r * Math.cos(phi);
          const zp = r * Math.sin(phi) * Math.sin(theta);
          if (zp >= 0) {
            if (lat === -90) ctx.moveTo(xp, yp);
            else ctx.lineTo(xp, yp);
          }
        }
        ctx.stroke();
      }

      // Land masses (visible side only)
      landMasses.forEach(({ lat, lng, size }) => {
        const { x, y, z } = latLngToXY(lat, lng, r, cx, cy, angle);
        if (z >= -r * 0.1) {
          const alpha = Math.max(0, Math.min(1, (z + r * 0.1) / (r * 0.8)));
          const scaledSize = (size / 800) * canvas.width;

          const landGrad = ctx.createRadialGradient(x, y, 0, x, y, scaledSize);
          landGrad.addColorStop(0, `rgba(0, 183, 255, ${0.35 * alpha})`);
          landGrad.addColorStop(0.6, `rgba(0, 120, 180, ${0.2 * alpha})`);
          landGrad.addColorStop(1, `rgba(0, 60, 120, 0)`);

          ctx.fillStyle = landGrad;
          ctx.beginPath();
          ctx.ellipse(x, y, scaledSize * 0.7, scaledSize * 0.5, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Highlight / specular shine
      const shineGrad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 0, cx - r * 0.1, cy - r * 0.1, r * 0.7);
      shineGrad.addColorStop(0, "rgba(255, 255, 255, 0.06)");
      shineGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = shineGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Edge darkening
      const edgeGrad = ctx.createRadialGradient(cx, cy, r * 0.75, cx, cy, r);
      edgeGrad.addColorStop(0, "rgba(0,0,0,0)");
      edgeGrad.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = edgeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Clip to globe for next layers
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.restore();

      angle += 0.12;
      animId = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <motion.div
      className="relative flex items-center justify-center w-full h-[480px] lg:h-[620px]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Outer glow rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[90%] h-[90%] rounded-full border border-primary/10 animate-[spin_30s_linear_infinite]" />
        <div className="absolute w-[75%] h-[75%] rounded-full border border-primary/5 animate-[spin_20s_linear_infinite_reverse]" />
      </div>

      <canvas
        ref={canvasRef}
        className="cursor-grab"
        style={{ borderRadius: "50%", boxShadow: "0 0 80px -20px rgba(0,183,255,0.4), 0 0 200px -50px rgba(0,183,255,0.15)" }}
      />

      {/* Live indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs text-muted-foreground font-medium">Live Tracking Active</span>
      </div>
    </motion.div>
  );
}
