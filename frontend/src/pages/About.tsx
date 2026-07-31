import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Link2, Zap, Shield, Heart, Code2, Coffee } from "lucide-react";
import { CallyMark, useFadeInView, fadeUp } from "../shared";
import logo from "../images/logo1.webp";
const STORY_POINTS = [
  {
    icon: Coffee,
    title: "It started with frustration",
    desc: "I was tired of the endless back-and-forth emails just to set up a 30-minute call. 'Does Tuesday work? No? How about Thursday?' Sound familiar?",
  },
  {
    icon: Code2,
    title: "So I built a fix",
    desc: "Cally started as a weekend project — a simple scheduling link I could share with anyone. You pick a time, it lands in my calendar. That's it.",
  },
  {
    icon: Heart,
    title: "Now it's for you too",
    desc: "What began as a personal tool is now open for everyone. No team, no VC funding — just clean, fast scheduling software built with care.",
  },
];

const VALUES = [
  { icon: Zap,      title: "Speed first",       desc: "Every interaction should feel instant. Scheduling a meeting shouldn't take longer than the meeting itself." },
  { icon: Shield,   title: "Privacy by design", desc: "Your data and your guests' data is yours. No ads, no tracking, no selling to third parties." },
  { icon: Calendar, title: "Simplicity always", desc: "Features are added only when they make things simpler, never to pad a feature list." },
  { icon: Link2,    title: "One link does it",  desc: "Your scheduling link should work everywhere — email, LinkedIn, Notion, a text message. No friction." },
];

const STACK = ["React", "Node.js", "MongoDB", "Express", "JWT Auth", "Tailwind CSS"];

export function About() {
  const storySection  = useFadeInView();
  const valuesSection = useFadeInView();
  const stackSection  = useFadeInView();

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

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="inline-flex items-center gap-2 bg-violet-50 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-violet-100">
          <Heart className="w-3 h-3" /> Built by one person, for everyone
        </motion.div>
        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6"
          style={{ fontFamily: "'Instrument Serif', serif" }}>
          Scheduling software that{" "}
          <span className="text-primary italic">respects your time</span>
        </motion.h1>
        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
          Cally is a solo project built out of genuine frustration with the way people coordinate meetings.
          No corporate agenda. No dark patterns. Just a tool that does exactly what it says.
        </motion.p>

        {/* Hero visual */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="relative bg-white border border-border rounded-3xl overflow-hidden shadow-xl max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-violet-600 via-primary to-violet-800 px-8 py-10 text-white text-left">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.14, 0.08] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-24 -translate-y-24" />
            <div className="relative">
              <p className="text-violet-200 text-xs font-bold uppercase tracking-widest mb-2">The mission</p>
              <p className="text-2xl font-extrabold leading-snug" style={{ fontFamily: "'Instrument Serif', serif" }}>
                "Make scheduling so frictionless that people stop dreading it."
              </p>
              <div className="flex items-center gap-3 mt-5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">A</div>
                <div>
                  <p className="font-bold text-sm">The Developer</p>
                  <p className="text-violet-200 text-xs">Founder & Solo Engineer, Cally</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Story */}
      <section ref={storySection.ref} className="bg-white border-y border-border py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div variants={fadeUp} initial="hidden" animate={storySection.inView ? "visible" : "hidden"}
            className="text-center mb-14">
            <p className="text-primary text-sm font-bold uppercase tracking-widest mb-3">The story</p>
            <h2 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
              How Cally came to be
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {STORY_POINTS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden"
                animate={storySection.inView ? "visible" : "hidden"} custom={i}
                className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-violet-50 border border-violet-100 rounded-2xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesSection.ref} className="max-w-5xl mx-auto px-6 py-24">
        <motion.div variants={fadeUp} initial="hidden" animate={valuesSection.inView ? "visible" : "hidden"}
          className="text-center mb-14">
          <p className="text-primary text-sm font-bold uppercase tracking-widest mb-3">Values</p>
          <h2 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
            What this project stands for
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} variants={fadeUp} initial="hidden"
              animate={valuesSection.inView ? "visible" : "hidden"} custom={i}
              whileHover={{ y: -4 }}
              className="bg-white border border-border rounded-2xl p-6 flex gap-4">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section ref={stackSection.ref} className="bg-white border-y border-border py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate={stackSection.inView ? "visible" : "hidden"}>
            <p className="text-primary text-sm font-bold uppercase tracking-widest mb-3">Built with</p>
            <h2 className="text-3xl font-extrabold tracking-tight mb-8" style={{ fontFamily: "'Instrument Serif', serif" }}>
              The tech behind Cally
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {STACK.map((tech, i) => (
                <motion.span key={tech} variants={fadeUp} custom={i}
                  initial="hidden" animate={stackSection.inView ? "visible" : "hidden"}
                  className="bg-background border border-border rounded-xl px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary transition-colors cursor-default">
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Give it a try — it&apos;s free
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Sign up in 30 seconds and have your first booking link ready in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/register"
                className="bg-primary text-white font-bold px-8 py-3.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 group">
                Get started free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact"
                className="border border-border text-foreground font-semibold px-8 py-3.5 rounded-xl hover:bg-secondary transition-colors block">
                Get in touch
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
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
            <Link to="/"        className="text-xs text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
