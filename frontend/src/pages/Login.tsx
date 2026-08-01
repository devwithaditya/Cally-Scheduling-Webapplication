import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, ArrowRight, Globe } from "lucide-react";
import { fadeUp } from "../shared";
import { useAuth } from "../context/AuthContext.tsx";
import api from "../services/api";
import logo from "../images/logo1.webp"
export function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const justVerified = params.get("verified") === "1";

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    await login(res.data.accessToken);

    navigate("/dashboard");
  } catch (err: any) {
    setError(
      err.response?.data?.message || "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen bg-background text-foreground flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Left: decorative ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] bg-white rounded-full" />

        <div className="relative flex items-center gap-2">
            <img
              src={logo}
              alt="Cally"
              className="w-10 h-12 object-contain"
            />
              <span
                className="text-3xl font-bold text-white tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                Cally
              </span>
        </div>

        <div className="relative">
          <motion.blockquote initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-white text-3xl font-extrabold leading-snug mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
              "The simplest scheduling tool I've ever used. My clients love it."
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&auto=format"
                alt="Marcus Obi" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30" />
              <div>
                <p className="text-white font-bold text-sm">Marcus Obi</p>
                <p className="text-violet-200 text-xs">Founder, Talon Studio</p>
              </div>
            </div>
          </motion.blockquote>

          <motion.div initial={{ opacity: 0, x: 32, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }} style={{ marginTop: "2rem" }}>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 max-w-xs">
              <p className="text-violet-100 text-xs font-semibold uppercase tracking-widest mb-3">Next meeting</p>
              <p className="text-white font-bold">Design Review · 2:30 PM</p>
              <p className="text-violet-200 text-xs mt-1">Mon, Jul 28 · Google Meet</p>
              <div className="flex gap-1 mt-3">
                {["#4285F4", "#E91E63", "#FF9800"].map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full ring-2 ring-white/30" style={{ backgroundColor: c }} />
                ))}
                <span className="text-violet-200 text-xs self-center ml-1">+2 guests</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right: form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="w-full max-w-md">

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img
              src={logo}
              alt="Cally"
              className="w-10 h-12 object-contain"
            />
            <span
              className="text-3xl font-bold leading-none"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Cally
            </span>
          </div>

          <h1 className="text-3xl font-extrabold mb-1" style={{ fontFamily: "'Instrument Serif', serif" }}>Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">Sign up free</Link>
          </p>

          {justVerified && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4 font-medium">
              ✓ Email verified! You can now sign in.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
                window.location.href =
                    `${import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"}/auth/google`;
            }}
            className="w-full flex items-center justify-center gap-3 border border-border rounded-xl py-3 text-sm font-semibold hover:bg-secondary transition-colors mb-6">
            <Globe className="w-4 h-4" />
            Continue with Google
          </motion.button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Email address</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground block">Password</label>
                <a href="#" className="text-xs text-primary font-semibold hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input required type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-border rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 group mt-1 disabled:opacity-60">
              {loading ? "Signing in…" : (
                <><span>Sign in</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </motion.button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-8">
            By signing in you agree to our{" "}
            <a href="#" className="underline hover:text-foreground">Terms</a> and{" "}
            <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
