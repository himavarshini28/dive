"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/* ─── tiny icon helpers ────────────────────────────────────────── */
const Icon = ({ d, size = 20 }: { d: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

/* ─── NAV ──────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-shadow">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" className="w-5 h-5">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Dive</span>
        </a>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
          {["Features", "How it works", "Pricing", "Testimonials"].map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                className="hover:text-white transition-colors"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-2">
            Log in
          </a>
          <a href="#" className="btn-primary text-sm px-5 py-2.5 rounded-xl">
            Start free →
          </a>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0f0f1a] border-b border-white/5 px-6 py-4 flex flex-col gap-4">
          {["Features", "How it works", "Pricing", "Testimonials"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              className="text-slate-300 text-sm"
              onClick={() => setOpen(false)}
            >
              {l}
            </a>
          ))}
          <a href="#" className="btn-primary text-sm text-center">Start free →</a>
        </div>
      )}
    </nav>
  );
}

/* ─── ANIMATED CANVAS DEMO ─────────────────────────────────────── */
function CanvasDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function rough(_ctx: CanvasRenderingContext2D, fn: () => void, _jitter = 1.5) {
      ctx.save();
      ctx.beginPath();
      fn();
      ctx.restore();
    }

    function drawRoughRect(
      ctx: CanvasRenderingContext2D,
      x: number, y: number, w: number, h: number,
      color: string, fill?: string
    ) {
      const j = 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      if (fill) {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.roundRect(x + j, y + j, w - j, h - j, 6);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.moveTo(x + Math.random() * j, y + Math.random() * j);
      ctx.lineTo(x + w + Math.random() * j, y + Math.random() * j);
      ctx.lineTo(x + w + Math.random() * j, y + h + Math.random() * j);
      ctx.lineTo(x + Math.random() * j, y + h + Math.random() * j);
      ctx.closePath();
      ctx.stroke();
    }

    function drawArrow(
      ctx: CanvasRenderingContext2D,
      x1: number, y1: number, x2: number, y2: number, color: string
    ) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const len = 10;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - len * Math.cos(angle - 0.4), y2 - len * Math.sin(angle - 0.4));
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - len * Math.cos(angle + 0.4), y2 - len * Math.sin(angle + 0.4));
      ctx.stroke();
    }

    function drawText(
      ctx: CanvasRenderingContext2D,
      text: string, x: number, y: number, color: string, size = 13
    ) {
      ctx.fillStyle = color;
      ctx.font = `${size}px 'Caveat', cursive`;
      ctx.fillText(text, x, y);
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, W, H);

      // Background dots grid
      ctx.fillStyle = "rgba(99,102,241,0.06)";
      for (let gx = 30; gx < W; gx += 30) {
        for (let gy = 30; gy < H; gy += 30) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const p = (Math.sin(t * 0.3) + 1) / 2; // 0..1 oscillation

      // ── Box: "User Research" ──
      drawRoughRect(ctx, 60, 60, 140, 60, "#a78bfa", "rgba(167,139,250,0.08)");
      drawText(ctx, "User Research", 72, 96, "#a78bfa");

      // ── Box: "Wireframes" ──
      drawRoughRect(ctx, 260, 60, 130, 60, "#818cf8", "rgba(129,140,248,0.08)");
      drawText(ctx, "Wireframes", 272, 96, "#818cf8");

      // ── Box: "Prototype" ──
      drawRoughRect(ctx, 450, 60, 120, 60, "#34d399", "rgba(52,211,153,0.08)");
      drawText(ctx, "Prototype", 462, 96, "#34d399");

      // ── Arrows between top boxes ──
      drawArrow(ctx, 200, 90, 258, 90, "rgba(148,163,184,0.5)");
      drawArrow(ctx, 390, 90, 448, 90, "rgba(148,163,184,0.5)");

      // ── Large box: "Design System" ──
      const dsW = 160 + 10 * Math.sin(t * 0.5);
      drawRoughRect(ctx, 60, 180, dsW, 80, "#f472b6", "rgba(244,114,182,0.08)");
      drawText(ctx, "Design System", 72, 224, "#f472b6", 14);
      drawText(ctx, "↳ colors · type · icons", 76, 244, "rgba(244,114,182,0.6)", 11);

      // ── Circle: "Feedback" ──
      const cx = 380, cy = 220;
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(245,158,11,0.08)";
      ctx.beginPath();
      ctx.arc(cx, cy, 50 + 2 * Math.sin(t * 0.7), 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      drawText(ctx, "Feedback", cx - 32, cy + 5, "#f59e0b", 14);

      // ── Freehand squiggle ──
      ctx.strokeStyle = "rgba(96,165,250,0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const sx = 500 + i * 1.5;
        const sy = 200 + Math.sin(i * 0.3 + t) * 18;
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      drawText(ctx, "user flow", 504, 278, "rgba(96,165,250,0.7)", 12);

      // ── Sticky note ──
      const sny = 300 + 4 * Math.sin(t * 0.4);
      drawRoughRect(ctx, 60, 310, 110, 90, "#fbbf24", "rgba(251,191,36,0.1)");
      drawText(ctx, "Notes ✏", 72, 336, "#fbbf24", 13);
      drawText(ctx, "• Mobile first", 70, 358, "rgba(251,191,36,0.7)", 11);
      drawText(ctx, "• Dark mode", 70, 375, "rgba(251,191,36,0.7)", 11);
      drawText(ctx, "• Collab v2", 70, 392, "rgba(251,191,36,0.7)", 11);

      // ── Arrow from DS to Feedback ──
      drawArrow(ctx, 224 + dsW * 0.5, 220, 328, 220, "rgba(148,163,184,0.35)");

      // ── Animated cursor 1 ──
      const c1x = 300 + 80 * Math.sin(t * 0.4);
      const c1y = 170 + 60 * Math.cos(t * 0.3);
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath();
      ctx.moveTo(c1x, c1y);
      ctx.lineTo(c1x + 12, c1y + 14);
      ctx.lineTo(c1x + 5, c1y + 12);
      ctx.lineTo(c1x + 3, c1y + 20);
      ctx.closePath();
      ctx.fill();
      ctx.font = "11px Inter, sans-serif";
      ctx.fillStyle = "#a78bfa";
      ctx.fillText("Alex", c1x + 14, c1y + 10);

      // ── Animated cursor 2 ──
      const c2x = 470 + 50 * Math.cos(t * 0.35 + 1);
      const c2y = 320 + 40 * Math.sin(t * 0.28 + 2);
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.moveTo(c2x, c2y);
      ctx.lineTo(c2x + 12, c2y + 14);
      ctx.lineTo(c2x + 5, c2y + 12);
      ctx.lineTo(c2x + 3, c2y + 20);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#34d399";
      ctx.fillText("Mira", c2x + 14, c2y + 10);
    }

    function loop() {
      tRef.current += 0.016;
      draw(tRef.current);
      frameRef.current = requestAnimationFrame(loop);
    }

    loop();
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.2)] bg-[#0f0f1a]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#13131f]">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-4 text-xs text-slate-500">dive — design sprint board</span>
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={420}
        className="w-full"
        style={{ imageRendering: "auto" }}
      />
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────── */
function Hero() {
  const [count, setCount] = useState({ users: 0, boards: 0, uptime: 0 });

  useEffect(() => {
    const targets = { users: 50000, boards: 2000000, uptime: 99 };
    const duration = 2000;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount({
        users: Math.floor(targets.users * ease),
        boards: Math.floor(targets.boards * ease),
        uptime: Math.floor(targets.uptime * ease),
      });
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden grid-bg"
    >
      {/* Glow orbs */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-radial from-violet-600/25 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-gradient-radial from-indigo-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] bg-gradient-radial from-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Badge */}
      <div className="animate-[fadeUp_0.6s_ease_forwards] mb-8">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">
          <span className="w-1 h-1 rounded-full bg-emerald-500/40 animate-pulse-slow" />
          Now with real-time collaboration
        </span>
      </div>

      {/* Headline */}
      <h1 className="animate-[fadeUp_0.7s_0.1s_ease_both] text-center text-5xl md:text-7xl font-black tracking-tighter text-white leading-[1.05] max-w-4xl">
        The infinite canvas
        <br />
        <span className="gradient-text">your ideas deserve</span>
      </h1>

      {/* Subtitle */}
      <p className="animate-[fadeUp_0.7s_0.2s_ease_both] mt-6 text-center text-lg text-slate-400 max-w-xl leading-relaxed">
        Sketch wireframes, diagrams, and mind maps with a beautiful hand-drawn aesthetic.
        Collaborate in real time — no friction, no limits.
      </p>

      {/* CTAs */}
      <div className="animate-[fadeUp_0.7s_0.3s_ease_both] mt-10 flex flex-wrap items-center justify-center gap-4">
        <a href="#" className="btn-primary px-7 py-3.5 text-base rounded-xl gap-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M12 5v14M5 12h14" />
          </svg>
          Start drawing free
        </a>
        <a href="#features" className="btn-outline px-7 py-3.5 text-base rounded-xl gap-2">
          See what&apos;s possible
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        No credit card required · Free forever plan · Open source
      </p>

      {/* Canvas Demo */}
      <div className="animate-[fadeUp_0.8s_0.4s_ease_both] mt-16 w-full max-w-3xl">
        <CanvasDemo />
      </div>

      {/* Stats */}
      <div className="mt-16 flex items-center gap-12 flex-wrap justify-center">
        {[
          { value: count.users.toLocaleString(), suffix: "+", label: "Active users" },
          { value: (count.boards / 1_000_000).toFixed(1), suffix: "M+", label: "Boards created" },
          { value: count.uptime, suffix: "%", label: "Uptime SLA" },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <div className="w-px h-10 bg-white/10" />}
            <div className="text-center">
              <p className="text-3xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                {s.value}
                <span className="text-xl">{s.suffix}</span>
              </p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="mt-14 scroll-indicator flex flex-col items-center gap-2 text-slate-600">
        <span className="text-xs">Scroll to explore</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}

/* ─── FEATURES ─────────────────────────────────────────────────── */
const features = [
  {
    icon: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
    title: "Hand-drawn aesthetic",
    desc: "Every shape feels natural — like it was sketched on a whiteboard. Choose from multiple roughness levels to match your style.",
    large: true,
  },
  {
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    title: "Real-time collaboration",
    desc: "Work with your team simultaneously. See everyone's cursors live — like Google Docs for diagrams.",
  },
  {
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    title: "Infinite canvas",
    desc: "Never run out of space. Pan, zoom, and explore your ideas without any boundaries.",
  },
  {
    icon: "M2 3h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3zM8 21h8M12 17v4",
    color: "#f472b6",
    bg: "rgba(244,114,182,0.08)",
    border: "rgba(244,114,182,0.2)",
    title: "Presentation mode",
    desc: "Present diagrams full-screen with smooth transitions. Impress stakeholders without leaving your canvas.",
  },
  {
    icon: "M16 18l6-6-6-6M8 6l-6 6 6 6",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.2)",
    title: "Open source & extendable",
    desc: "MIT licensed core. Build plugins, embed into your product, or self-host with full control.",
  },
  {
    icon: "M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 6 0V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.2)",
    title: "Smart connectors & flowcharts",
    desc: "Auto-routing arrows stay connected as you move shapes. Build complex flowcharts in seconds with smart snap and align.",
    large: true,
    tags: ["Auto-route", "Smart snap", "Export SVG/PNG"],
  },
];

function Features() {
  return (
    <section id="features" className="py-28 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <span className="section-tag">Features</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Everything you need to{" "}
          <span className="gradient-text">think visually</span>
        </h2>
        <p className="mt-4 text-slate-400 text-lg">
          From quick sketches to polished diagrams — all in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[minmax(200px,auto)]">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`glass glass-hover rounded-2xl p-7 flex flex-col gap-4 ${
              f.large ? "lg:col-span-1" : ""
            }`}
            style={{
              background: f.bg,
              border: `1px solid ${f.border}`,
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke={f.color}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d={f.icon} />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">{f.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            {f.tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {f.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/8"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─────────────────────────────────────────────── */
const steps = [
  {
    num: "01",
    title: "Open a new board",
    desc: "No sign-up needed to get started. Just click and your blank infinite canvas appears instantly in the browser.",
    color: "#a78bfa",
  },
  {
    num: "02",
    title: "Draw & arrange",
    desc: "Use shapes, arrows, text, and freehand drawing. Everything auto-aligns with smart guides and snapping.",
    color: "#34d399",
  },
  {
    num: "03",
    title: "Share & collaborate",
    desc: "Share a link. Your teammates join instantly — no install, no friction, just real-time drawing together.",
    color: "#f59e0b",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 bg-[#0d0d18]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <div className="flex justify-center mb-4">
            <span className="section-tag">Workflow</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Up and running in{" "}
            <span className="gradient-text">30 seconds</span>
          </h2>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/40 via-emerald-500/30 to-amber-500/30 hidden md:block" />

          <div className="flex flex-col gap-16">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className={`flex items-center gap-12 ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} flex-col md:flex-row`}
              >
                {/* Text */}
                <div className="flex-1 md:text-left text-center">
                  <span
                    className="text-7xl font-black opacity-10 font-mono"
                    style={{ color: s.color }}
                  >
                    {s.num}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-2 mb-3">{s.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{s.desc}</p>
                </div>

                {/* Node */}
                <div className="relative shrink-0">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black z-10 relative"
                    style={{
                      background: `${s.color}18`,
                      border: `2px solid ${s.color}40`,
                      color: s.color,
                      boxShadow: `0 0 30px ${s.color}25`,
                    }}
                  >
                    {s.num.replace("0", "")}
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ─────────────────────────────────────────────── */
const testimonials = [
  {
    text: "Sketchflow replaced Figma and Miro for daily standups. Fast, beautiful, and our engineers actually love it.",
    name: "Jamie Liu",
    role: "Head of Design, Notion",
    avatar: "JL",
    grad: "from-violet-400 to-indigo-500",
  },
  {
    text: "The hand-drawn feel is exactly what we needed for early brainstorming. Nothing else comes close.",
    name: "Marcus Kim",
    role: "CTO, Linear",
    avatar: "MK",
    grad: "from-emerald-400 to-teal-600",
  },
  {
    text: "We ditched Miro and saved $2,400/yr. Sketchflow does everything we need and it's free for our team size.",
    name: "Sophie Rao",
    role: "Product Lead, Vercel",
    avatar: "SR",
    grad: "from-amber-400 to-orange-600",
  },
  {
    text: "Open source and this polished? I don't understand how this is free. My whole team switched in a day.",
    name: "Alice Wong",
    role: "Staff Engineer, Stripe",
    avatar: "AW",
    grad: "from-pink-400 to-rose-600",
  },
  {
    text: "Embed mode is a game-changer. We have Sketchflow boards right inside our Notion docs now.",
    name: "Tom Chen",
    role: "Frontend Engineer, Figma",
    avatar: "TC",
    grad: "from-sky-400 to-blue-600",
  },
];

function Testimonials() {
  const cards = [...testimonials, ...testimonials];
  return (
    <section id="testimonials" className="py-28 overflow-hidden">
      <div className="text-center mb-16 px-6">
        <div className="flex justify-center mb-4">
          <span className="section-tag">Love from users</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Trusted by <span className="gradient-text">creative teams</span> worldwide
        </h2>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

        <div className="flex testimonials-inner gap-6 w-max">
          {cards.map((t, i) => (
            <div
              key={i}
              className="w-80 glass rounded-2xl p-6 flex flex-col gap-4 shrink-0"
            >
              <div className="flex text-amber-400 text-base gap-0.5">
                {"★★★★★".split("").map((s, j) => <span key={j}>{s}</span>)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 mt-auto">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center text-xs font-bold text-white shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ──────────────────────────────────────────────────── */
function Pricing() {
  const [yearly, setYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      price: 0,
      desc: "Perfect for individuals experimenting with visual thinking.",
      features: ["3 active boards", "Up to 3 collaborators", "PNG & SVG export", "Community support"],
      cta: "Get started free",
      outline: true,
    },
    {
      name: "Pro",
      price: yearly ? 8 : 12,
      desc: "For teams who collaborate daily and need unlimited power.",
      features: ["Unlimited boards", "Unlimited collaborators", "Version history (90 days)", "Priority support", "Embed anywhere"],
      cta: "Start Pro free trial",
      featured: true,
    },
    {
      name: "Enterprise",
      price: null,
      desc: "For large orgs needing compliance, SSO, and dedicated support.",
      features: ["Everything in Pro", "SSO / SAML", "Self-hosting option", "Dedicated success manager"],
      cta: "Contact sales",
      outline: true,
    },
  ];

  return (
    <section id="pricing" className="py-28 px-6 bg-[#0d0d18]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <span className="section-tag">Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Simple, <span className="gradient-text">transparent pricing</span>
          </h2>
          <p className="mt-4 text-slate-400">Start free. Scale as you grow. No hidden fees.</p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium transition-colors ${!yearly ? "text-white" : "text-slate-500"}`}>Monthly</span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? "bg-indigo-500" : "bg-slate-700"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${yearly ? "translate-x-7" : "translate-x-1"}`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${yearly ? "text-white" : "text-slate-500"}`}>
              Yearly
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded-full">Save 30%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl p-8 flex flex-col gap-6 relative overflow-hidden transition-transform hover:-translate-y-1 ${
                p.featured
                  ? "bg-gradient-to-b from-indigo-600/20 to-violet-600/10 border border-indigo-500/40 shadow-[0_0_60px_rgba(99,102,241,0.2)]"
                  : "glass"
              }`}
            >
              {p.featured && (
                <div className="absolute top-4 right-4 text-xs font-bold bg-indigo-500 text-white px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{p.name}</p>
                <div className="mt-2 flex items-end gap-1">
                  {p.price !== null ? (
                    <>
                      <span className="text-5xl font-black text-white">${p.price}</span>
                      <span className="text-slate-400 mb-2">/mo per seat</span>
                    </>
                  ) : (
                    <span className="text-4xl font-black text-white">Custom</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">{p.desc}</p>
              </div>

              <ul className="flex flex-col gap-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-400 shrink-0">
                      <path d="M16.7 5.3a1 1 0 0 0-1.4 0L8 12.6 4.7 9.3a1 1 0 1 0-1.4 1.4l4 4a1 1 0 0 0 1.4 0l8-8a1 1 0 0 0 0-1.4z" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`mt-auto block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  p.featured
                    ? "btn-primary"
                    : "btn-outline"
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA BANNER ───────────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-4xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-gradient-radial from-violet-600/20 to-transparent rounded-3xl blur-2xl pointer-events-none" />
        <div className="relative glass rounded-3xl p-16 border border-indigo-500/20">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Ready to{" "}
            <span className="gradient-text">draw something amazing?</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg">
            Join 50,000+ teams who think visually with Sketchflow every day.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#" className="btn-primary px-8 py-4 text-base rounded-xl gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M12 5v14M5 12h14" />
              </svg>
              Open Sketchflow free
            </a>
            <a href="#" className="btn-outline px-8 py-4 text-base rounded-xl">
              View on GitHub →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ───────────────────────────────────────────────────── */
const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Developers: ["Documentation", "API Reference", "GitHub", "Embed guide"],
  Company: ["About", "Blog", "Careers", "Press kit"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#080810]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12 justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" className="w-5 h-5">
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">Dive</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              The open-source infinite canvas for modern teams who think visually.
            </p>
            <div className="flex gap-3 mt-5">
              {["GitHub", "X", "Discord"].map((name) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-violet-400 hover:border-violet-400/30 transition-colors"
                >
                  {name[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([col, links]) => (
              <div key={col}>
                <h4 className="text-white text-sm font-semibold mb-4">{col}</h4>
                <ul className="flex flex-col gap-2.5">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
          <span>© 2025 Sketchflow, Inc. All rights reserved.</span>
          <span>Made with ♥ and open source</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ROOT ────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
