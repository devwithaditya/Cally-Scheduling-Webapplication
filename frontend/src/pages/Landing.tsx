import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Clock, Link2, Users, ChevronRight, Check, Star, ArrowRight, Menu, X, Zap, Shield, Globe, Bell, Calendar } from "lucide-react";
import {  useFadeInView, fadeUp } from "../shared";
import logo from "../images/logo1.webp"
const NAV_LINKS = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const FEATURES = [
  { icon: Calendar, title: "Smart Scheduling", desc: "Share your availability in seconds. Guests pick a time that works — no back-and-forth emails." },
  { icon: Link2,    title: "One Link, Infinite Meetings", desc: "Create a single scheduling link for all your meeting types. Share it anywhere, anytime." },
  { icon: Zap,      title: "Automated Reminders", desc: "Cut no-shows by 80% with automated email and SMS reminders before every meeting." },
  { icon: Users,    title: "Team Scheduling", desc: "Round-robin, collective, and pooled availability so your whole team stays in sync." },
  { icon: Shield,   title: "Buffer Time", desc: "Automatically add prep or wind-down time before and after meetings. Never feel rushed." },
  { icon: Globe,    title: "Global Time Zones", desc: "Time zone detection handles the math for international guests so no one shows up an hour late." },
];

const TESTIMONIALS = [
  { name: "Sarah Kim", role: "Head of Sales, Meridian", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format", quote: "We reduced meeting scheduling time by 90%. Our reps spend that time selling, not emailing.", stars: 5 },
  { name: "Marcus Obi", role: "Founder, Talon Studio", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format", quote: "Client onboarding used to take 3 days of back-and-forth. Now it takes 3 minutes.", stars: 5 },
  { name: "Priya Nair", role: "Recruiting Lead, Vertex Health", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&auto=format", quote: "We interview 40+ candidates a week. Without Cally we'd need two extra coordinators.", stars: 5 },
];

const STEPS = [
  { number: "01", title: "Connect your calendar", desc: "Link your Google or Outlook calendar in one click. Cally reads your real availability so guests never double-book you.", icon: Calendar },
  { number: "02", title: "Share your link", desc: "Copy your personal booking link and share it anywhere — email, LinkedIn, your website, or a text message.", icon: Link2 },
  { number: "03", title: "Guests pick a time", desc: "They choose a slot that works for them, fill in their details, and a confirmed meeting lands in both calendars instantly.", icon: Check },
];

const INTEGRATIONS = [
  { name: "Google Calendar", color: "#4285F4" },
  { name: "Outlook",         color: "#0078D4" },
  { name: "Zoom",            color: "#2D8CFF" },
  { name: "Slack",           color: "#4A154B" },
  { name: "HubSpot",         color: "#FF7A59" },
  { name: "Salesforce",      color: "#00A1E0" },
];

const TIMES = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];
const DAYS = ["", "", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
const BLOCKED = [3, 7, 10, 14, 17, 21, 24];

export function Landing() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [selectedTime, setSelectedTime] = useState("10:30 AM");
  const [selectedDay, setSelectedDay]   = useState(28);
  const [badgeVisible, setBadgeVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBadgeVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const featuresSection     = useFadeInView();
  const integrationsSection = useFadeInView();
  const testimonialsSection = useFadeInView();
  const howItWorksSection   = useFadeInView();
  const ctaSection          = useFadeInView();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Nav ── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img
                src={logo}
                alt="Cally"
                className="w-8 h-8 object-contain"
              />
            <span
              className="text-2xl font-bold leading-none"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Cally
            </span>
          </div>
              <nav className="hidden md:flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200 px-4 py-2">
              Log in
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors duration-200 block">
                Get started free
              </Link>
            </motion.div>
          </div>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-semibold text-muted-foreground"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Link to="/login" className="text-sm font-semibold">Log in</Link>
              <Link to="/register" className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl text-center">Get started free</Link>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="inline-flex items-center gap-2 bg-violet-50 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-violet-100">
              <Bell className="w-3 h-3" />
              New: Automated reminders are here
            </motion.div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6"
              style={{ fontFamily: "'Instrument Serif', serif" }}>
              Scheduling that{" "}<span className="text-primary italic">actually</span>{" "}works for you
            </motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Stop the email ping-pong. Share your link, let guests pick a time, and get back to the work that matters.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-col sm:flex-row gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register"
                  className="bg-primary text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-violet-700 transition-colors duration-200 flex items-center justify-center gap-2 group">
                  Get started — it&apos;s free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="border border-border text-foreground font-semibold px-7 py-3.5 rounded-xl hover:bg-secondary transition-colors duration-200">
                Watch demo
              </motion.button>
            </motion.div>
            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={4}
              className="mt-4 text-xs text-muted-foreground">
              No credit card required · Free forever plan · Setup in 2 minutes
            </motion.p>
          </div>

          {/* Calendar mock */}
          <motion.div
            initial={{ opacity: 0, x: 48, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
          >
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
              <div className="bg-primary px-6 py-5 text-white">
                <p className="text-sm font-medium opacity-80">30-Minute Meeting</p>
                <h3 className="text-xl font-bold mt-0.5">Pick a time with Alex Chen</h3>
                <div className="flex items-center gap-4 mt-3 text-xs opacity-75">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 30 min</span>
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Video call</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm">July 2026</h4>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground text-xs">‹</button>
                    <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground text-xs">›</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
                    <div key={d} className="text-xs text-muted-foreground font-semibold py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {DAYS.map((d, i) => (
                    <motion.button key={i}
                      whileHover={d !== "" && !BLOCKED.includes(d as number) ? { scale: 1.15 } : {}}
                      whileTap={d !== "" && !BLOCKED.includes(d as number) ? { scale: 0.92 } : {}}
                      onClick={() => d !== "" && !BLOCKED.includes(d as number) && setSelectedDay(d as number)}
                      className={`text-sm py-2 rounded-lg transition-all duration-150 font-medium ${
                        d === "" ? "invisible"
                        : d === selectedDay ? "bg-primary text-white"
                        : BLOCKED.includes(d as number) ? "text-muted-foreground cursor-not-allowed opacity-40"
                        : "hover:bg-violet-50 hover:text-primary"
                      }`}>
                      {d}
                    </motion.button>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Available times — Mon, Jul {selectedDay}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {TIMES.map((t) => (
                      <motion.button key={t} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTime(t)}
                        className={`text-xs font-semibold py-2 rounded-lg border transition-all duration-150 ${
                          t === selectedTime ? "bg-primary text-white border-primary" : "border-border hover:border-primary hover:text-primary"
                        }`}>
                        {t}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={badgeVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="absolute -bottom-4 -left-4 bg-white border border-border rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-bold">Meeting booked!</p>
                <p className="text-xs text-muted-foreground">Mon, Jul {selectedDay} · {selectedTime}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-border py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-border">
            {[
              { value: "2 min", label: "Average setup time", sub: "From signup to first link" },
              { value: "80%",   label: "Fewer no-shows",     sub: "With automated reminders" },
              { value: "Zero",  label: "Back-and-forth emails", sub: "Guests self-schedule" },
              { value: "24 / 7", label: "Always available",  sub: "Your link never sleeps" },
            ].map(({ value, label, sub }, i) => (
              <motion.div key={label} variants={fadeUp} custom={i}
                className="flex flex-col items-center text-center px-6">
                <span className="text-3xl lg:text-4xl font-extrabold text-primary mb-1"
                  style={{ fontFamily: "'Instrument Serif', serif" }}>{value}</span>
                <span className="text-sm font-bold text-foreground mb-0.5">{label}</span>
                <span className="text-xs text-muted-foreground">{sub}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section ref={featuresSection.ref} className="max-w-7xl mx-auto px-6 py-24">
        <motion.div variants={fadeUp} initial="hidden" animate={featuresSection.inView ? "visible" : "hidden"}
          className="text-center mb-16">
          <p className="text-primary text-sm font-bold uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Everything scheduling, nothing extra
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
            Built for professionals who need scheduling to just work — elegant, fast, and always reliable.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} variants={fadeUp} initial="hidden"
              animate={featuresSection.inView ? "visible" : "hidden"} custom={i}
              whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(124,58,237,0.10)" }}
              className="bg-white border border-border rounded-2xl p-6 group cursor-default">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-base mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Integrations ── */}
      <section ref={integrationsSection.ref} className="bg-white border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" animate={integrationsSection.inView ? "visible" : "hidden"}>
              <p className="text-primary text-sm font-bold uppercase tracking-widest mb-3">Integrations</p>
              <h2 className="text-4xl font-extrabold tracking-tight mb-5" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Works with the tools you already love
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Connect Cally to your calendar, video conferencing, CRM, and more — in one click.
              </p>
              <motion.button whileHover={{ x: 4 }} className="flex items-center gap-2 text-primary font-semibold text-sm">
                See all 100+ integrations <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {INTEGRATIONS.map(({ name, color }, i) => (
                <motion.div key={name} variants={fadeUp} initial="hidden"
                  animate={integrationsSection.inView ? "visible" : "hidden"} custom={i}
                  whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                  className="bg-background border border-border rounded-xl px-5 py-4 flex items-center gap-3 cursor-default">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "18" }}>
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }} />
                  </div>
                  <span className="text-sm font-semibold">{name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section ref={testimonialsSection.ref} className="max-w-7xl mx-auto px-6 py-24">
        <motion.div variants={fadeUp} initial="hidden" animate={testimonialsSection.inView ? "visible" : "hidden"}
          className="text-center mb-16">
          <p className="text-primary text-sm font-bold uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Loved by 500,000+ professionals
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, avatar, quote, stars }, i) => (
            <motion.div key={name} variants={fadeUp} initial="hidden"
              animate={testimonialsSection.inView ? "visible" : "hidden"} custom={i}
              whileHover={{ y: -5 }}
              className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex">
                {Array.from({ length: stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground flex-1">&ldquo;{quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover bg-secondary" />
                <div>
                  <p className="text-sm font-bold">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section ref={howItWorksSection.ref} className="bg-white border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" animate={howItWorksSection.inView ? "visible" : "hidden"}
            className="text-center mb-16">
            <p className="text-primary text-sm font-bold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Up and running in three steps
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
              No complicated setup. No back-and-forth. Just a link that does the work for you.
            </p>
          </motion.div>
          <div className="relative grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-violet-200 via-primary/40 to-violet-200" />
            {STEPS.map(({ number, title, desc, icon: Icon }, i) => (
              <motion.div key={number} variants={fadeUp} initial="hidden"
                animate={howItWorksSection.inView ? "visible" : "hidden"} custom={i}
                className="flex flex-col items-center text-center relative">
                <motion.div whileHover={{ scale: 1.1, rotate: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="w-20 h-20 rounded-2xl bg-primary flex flex-col items-center justify-center mb-6 shadow-lg shadow-violet-200 relative z-10">
                  <Icon className="w-7 h-7 text-white" />
                  <span className="text-[10px] font-bold text-violet-200 mt-0.5 tracking-widest">{number}</span>
                </motion.div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaSection.ref} className="max-w-7xl mx-auto px-6 py-24">
        <motion.div variants={fadeUp} initial="hidden" animate={ctaSection.inView ? "visible" : "hidden"}
          className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-primary to-violet-800" />
          <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-32 -translate-y-32" />
          <motion.div animate={{ scale: [1, 1.3, 1], x: [0, -16, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-24 translate-y-24" />
          <div className="relative px-8 md:px-16 py-16 grid md:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <p className="text-violet-200 text-sm font-bold uppercase tracking-widest mb-3">Get started today</p>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Your scheduling link,{" "}<span className="italic">ready in minutes</span>
              </h2>
              <p className="text-violet-100 text-lg leading-relaxed">
                Create your account, connect your calendar, and share your link — it&apos;s that simple.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-7 shadow-2xl">
              <h3 className="font-bold text-lg mb-1">Create your free account</h3>
              <p className="text-sm text-muted-foreground mb-5">Start scheduling in under 2 minutes.</p>
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Your name"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 bg-background" />
                <input type="email" placeholder="Email address"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 bg-background" />
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/register"
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-violet-700 transition-colors duration-200 flex items-center justify-center gap-2 group">
                    Create free account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </motion.div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">No credit card · Free forever · Cancel anytime</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
                src={logo}
                alt="Cally"
                className="w-8 h-8 object-contain"
              />
            <span
              className="text-2xl font-bold leading-none"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Cally
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Built with ♥ as a solo project · © 2026</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">Privacy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">Terms</a>
            <Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
