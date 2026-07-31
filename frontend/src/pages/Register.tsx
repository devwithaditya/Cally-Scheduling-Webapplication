import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, ArrowRight, Check, Mail } from "lucide-react";
import { CallyMark, fadeUp } from "../shared";
import api from "../services/api";
import logo from "../images/logo1.webp"
const PERKS = [
  "Free forever — no credit card needed",
  "Your link ready in under 2 minutes",
  "Connects with Google & Outlook",
  "Automatic time zone detection",
];

export function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"register" | "otp">("register");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  // Register form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OTP form
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-green-500"][strength];

async function handleRegister(e: React.FormEvent) {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    await api.post("/auth/register", {
      username: name,
      email,
      password,
    });

    setPendingEmail(email);
    setStep("otp");
  } catch (err: any) {
    setError(
      err.response?.data?.message || "Registration failed"
    );
  } finally {
    setLoading(false);
  }
}

 async function handleOtp(e: React.FormEvent) {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    await api.post("/auth/otp-verify", {
      email: pendingEmail,
      otp: otp.join(""),
    });

    navigate("/login?verified=1");
  } catch (err: any) {
    setError(
      err.response?.data?.message || "Invalid OTP"
    );
  } finally {
    setLoading(false);
  }
}

  function handleOtpInput(val: string, idx: number) {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  }

  function handleOtpKey(e: React.KeyboardEvent, idx: number) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Left: form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <img
              src={logo}
              alt="Cally"
              className="w-10 h-12 object-contain"
            />
              <span
                className="text-4xl font-bold"
                style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                Cally
              </span>
          </div>

          <AnimatePresence mode="wait">
            {step === "register" ? (
              <motion.div key="register" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -16 }}>
                <h1 className="text-3xl font-extrabold mb-1" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Create your account
                </h1>
                <p className="text-muted-foreground text-sm mb-8">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Full name</label>
                    <input required value={name} onChange={e => setName(e.target.value)} placeholder="Alex Chen"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Email address</label>
                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@example.com"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Password</label>
                    <div className="relative">
                      <input required type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full border border-border rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background" />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {password.length > 0 && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength >= s ? strengthColor : "bg-border"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{strengthLabel} password</p>
                      </div>
                    )}
                  </div>

                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 group mt-1 disabled:opacity-60">
                    {loading ? "Creating account…" : (
                      <><span>Create free account</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </motion.button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-6">
                  By signing up you agree to our{" "}
                  <a href="#" className="underline hover:text-foreground">Terms</a> and{" "}
                  <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
                </p>
              </motion.div>
            ) : (
              <motion.div key="otp" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -16 }}>
                <div className="w-14 h-14 bg-violet-50 border border-violet-100 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>Check your email</h1>
                <p className="text-muted-foreground text-sm mb-8">
                  We sent a 6-digit code to <span className="font-semibold text-foreground">{pendingEmail}</span>. Enter it below to verify your account.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
                )}

                <form onSubmit={handleOtp} className="flex flex-col gap-6">
                  <div className="flex gap-3 justify-center">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpInput(e.target.value, idx)}
                        onKeyDown={e => handleOtpKey(e, idx)}
                        className="w-12 h-14 text-center text-xl font-bold border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background"
                      />
                    ))}
                  </div>

                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading || otp.join("").length < 6}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 group disabled:opacity-60">
                    {loading ? "Verifying…" : (
                      <><Check className="w-4 h-4" /><span>Verify & continue</span></>
                    )}
                  </motion.button>
                </form>

                <button onClick={() => setStep("register")} className="mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors block text-center w-full">
                  ← Back to sign up
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right: decorative ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary relative overflow-hidden flex-col justify-center p-14">
        <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.07, 0.13, 0.07] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-28 -right-28 w-[28rem] h-[28rem] bg-white rounded-full" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -bottom-24 -left-20 w-80 h-80 bg-white rounded-full" />
        <div className="relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-violet-200 text-xs font-bold uppercase tracking-widest mb-4">What you get</p>
            <h2 className="text-white text-4xl font-extrabold leading-tight mb-8" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Everything you need to schedule smarter
            </h2>
            <ul className="flex flex-col gap-4 mb-10">
              {PERKS.map((perk, i) => (
                <motion.li key={perk} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.35 + i * 0.09 }}
                  className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-violet-100 text-sm font-medium">{perk}</span>
                </motion.li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-3">
              {[{ value: "2 min", label: "Setup time" }, { value: "80%", label: "Fewer no-shows" }].map(({ value, label }) => (
                <div key={label} className="bg-white/10 border border-white/15 rounded-2xl p-4">
                  <p className="text-white text-2xl font-extrabold" style={{ fontFamily: "'Instrument Serif', serif" }}>{value}</p>
                  <p className="text-violet-200 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
