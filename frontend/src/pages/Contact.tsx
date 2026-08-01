import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowRight, Check, MessageSquare, Bug, Lightbulb, HelpCircle, User} from "lucide-react";
import {FaGithub, FaLinkedin} from "react-icons/fa6";
import { fadeUp } from "../shared";
import logo from "../images/logo1.webp";
const REASONS = [
  { id: "feedback",   icon: MessageSquare, label: "General feedback" },
  { id: "bug",        icon: Bug,           label: "Report a bug" },
  { id: "feature",    icon: Lightbulb,     label: "Feature request" },
  { id: "help",       icon: HelpCircle,    label: "I need help" },
];

const SOCIALS = [
  { icon: Mail,   label: "Email",   href: "mailto:rajadityafeb22@gmail.com", sub: "rajadityafeb22@gmail.com" },
  { icon: FaGithub, label: "GitHub",  href: "https://github.com/devwithaditya",sub: "View the source code" },
  { icon: FaLinkedin,label: "Linkedin", href: "www.linkedin.com/in/codewithaditya",sub: "@Linkedin" },
  { icon: User,label: "Portfolio", href: "http://devwithaditya.me/",sub: "@Portfolio" },

];

export function Contact() {
  const [reason, setReason]   = useState("feedback");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulated send — wire to your email service
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
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
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
              Log in
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register" className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors block">
                Get started free
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-start">

          {/* Left: form */}
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="inline-flex items-center gap-2 bg-violet-50 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-violet-100">
              <MessageSquare className="w-3 h-3" /> Always happy to hear from you
            </motion.div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-4"
              style={{ fontFamily: "'Instrument Serif', serif" }}>
              Get in touch
            </motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="text-muted-foreground text-lg mb-10 max-w-lg">
              Got feedback, found a bug, or just want to say hi? I read every message and reply as fast as I can.
            </motion.p>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-border rounded-2xl p-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Check className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h2 className="text-xl font-extrabold mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>Message sent!</h2>
                  <p className="text-muted-foreground text-sm mb-6">Thanks for reaching out. I'll get back to you at <span className="font-semibold text-foreground">{email}</span> within 24 hours.</p>
                  <button onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
                    className="text-sm text-primary font-semibold hover:underline">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" variants={fadeUp} initial="hidden" animate="visible" custom={3}
                  onSubmit={handleSubmit}
                  className="bg-white border border-border rounded-2xl p-7 flex flex-col gap-5">

                  {/* Reason picker */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2 block">
                      What&apos;s this about?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {REASONS.map(({ id, icon: Icon, label }) => (
                        <button key={id} type="button" onClick={() => setReason(id)}
                          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                            reason === id
                              ? "bg-primary text-white border-primary"
                              : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                          }`}>
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Your name</label>
                      <input required value={name} onChange={e => setName(e.target.value)}
                        placeholder="Alex Chen"
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Email address</label>
                      <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Message</label>
                    <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={5}
                      placeholder="Tell me what's on your mind…"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background resize-none" />
                  </div>

                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    type="submit" disabled={loading}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 group disabled:opacity-60">
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
                    ) : (
                      <><span>Send message</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Right: contact info */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="flex flex-col gap-6 lg:pt-36">

            {/* Response time */}
            <div className="bg-white border border-border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Typical response time</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-3xl font-extrabold text-primary" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  &lt; 24h
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Usually much faster. I check messages daily.</p>
            </div>

            {/* Social links */}
            <div className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Other ways to reach me</p>
              {SOCIALS.map(({ icon: Icon, label, href, sub }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group">
                  <div className="w-9 h-9 bg-violet-50 border border-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                </motion.a>
              ))}
            </div>

            {/* Quick links */}
            <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Quick links</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Read about Cally",    to: "/about" },
                  { label: "Create free account", to: "/register" },
                  { label: "Sign in",             to: "/login" },
                ].map(({ label, to }) => (
                  <Link key={to} to={to}
                    className="text-sm font-semibold text-primary hover:text-violet-700 flex items-center gap-1.5 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" /> {label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-4">
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
          <div className="flex items-center gap-5">
            <Link to="/"      className="text-xs text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
