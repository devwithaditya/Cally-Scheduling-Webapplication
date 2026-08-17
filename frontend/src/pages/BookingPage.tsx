import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Globe, Check, ChevronLeft, ChevronRight, Calendar, User } from "lucide-react";
import {  fadeUp } from "../shared";
import api from "../services/api";
import logo from "../images/logo.png"
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

interface EventInfo { title: string; duration: number; description: string; user: string; timezone: string; }

type Step = "calendar" | "form" | "confirmed";

export function BookingPage() {
  const { userSlug, eventSlug } = useParams<{ userSlug: string; eventSlug: string }>();

  const [eventInfo, setEventInfo]   = useState<EventInfo | null>(null);
  const [notFound, setNotFound]     = useState(false);
  const [step, setStep]             = useState<Step>("calendar");

  // Calendar state
  const today = new Date();
  const [viewYear, setViewYear]     = useState(today.getFullYear());
  const [viewMonth, setViewMonth]   = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots]           = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Form state
  const [guestName, setGuestName]   = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [notes, setNotes]           = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState("");
  const [, setBooking]       = useState<any>(null);

useEffect(() => {
  async function loadEvent() {
    try {
      const res = await api.get(`/event-type/${eventSlug}/${userSlug}`);
      setEventInfo(res.data);
    } catch {
      setNotFound(true);
    }
  }

  loadEvent();
}, [userSlug, eventSlug]);

useEffect(() => {
  if (!selectedDate) return;

  async function loadSlots() {
    setSlotsLoading(true);

    try {
      const res = await api.get(
        `/bookings/${userSlug}/${eventSlug}`,
        {
          params: {
            date: selectedDate,
          },
        }
      );

      setSlots(res.data.slots ?? []);
    } finally {
      setSlotsLoading(false);
    }
  }

  loadSlots();
}, [selectedDate, userSlug, eventSlug]);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setFormError(""); setSubmitting(true);
    try {
const res = await api.post(
    `/bookings/${userSlug}/${eventSlug}`,
    {
        guestName,
        guestEmail,
        date: selectedDate,
        startTime: selectedTime,
        notes,
    }
);

setBooking(res.data.booking);
setStep("confirmed");
    } catch (err: any) { setFormError(err.message); }
    finally { setSubmitting(false); }
  }

  // Calendar helpers
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function isDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  function dateStr(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  function formatTime(t: string) {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${ampm}`;
  }

  if (notFound) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-center px-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div>
          <img
            src={logo}
            alt="Cally"
            className="w-10 h-12 object-contain"
          />
          <span className="font-bold text-2xl">Cally</span>
        <h1 className="text-2xl font-extrabold mt-6 mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>Page not found</h1>
        <p className="text-muted-foreground text-sm">This booking link doesn't exist or has been removed.</p>
      </div>
    </div>
  );

  if (!eventInfo) return (
    <div className="min-h-screen bg-background flex items-center justify-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div className="border-b border-border bg-white px-6 py-4 flex items-center gap-2">
        <img
          src={logo}
          alt="Cally"
          className="w-10 h-10 object-contain flex-shrink-0"
        />
        <span className="font-bold text-2xl">Cally</span>
      </div>

      <div className="flex-1 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Calendar ── */}
            {step === "calendar" && (
              <motion.div key="calendar" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }}
                className="grid lg:grid-cols-[280px_1fr] gap-0 bg-white rounded-2xl shadow-xl border border-border overflow-hidden">

                {/* Left info panel */}
                <div className="p-7 border-r border-border">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "#7C3AED22" }}>
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">{eventInfo.user}</p>
                  <h1 className="text-xl font-extrabold mb-3" style={{ fontFamily: "'Instrument Serif', serif" }}>{eventInfo.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{eventInfo.duration} min</span>
                  </div>
                  {eventInfo.timezone && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <span>{eventInfo.timezone}</span>
                    </div>
                  )}
                  {eventInfo.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{eventInfo.description}</p>
                  )}
                </div>

                {/* Calendar + slots */}
                <div className="p-7">
                  {/* Month nav */}
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold">{MONTH_NAMES[viewMonth]} {viewYear}</h2>
                    <div className="flex gap-1">
                      <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {DAY_NAMES.map(d => <div key={d} className="text-center text-xs text-muted-foreground font-semibold py-1">{d}</div>)}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {cells.map((day, i) => (
                      <motion.button key={i}
                        whileHover={day && !isDisabled(day) ? { scale: 1.1 } : {}}
                        whileTap={day && !isDisabled(day) ? { scale: 0.92 } : {}}
                        disabled={!day || isDisabled(day)}
                        onClick={() => day && !isDisabled(day) && setSelectedDate(dateStr(day))}
                        className={`text-sm py-2 rounded-lg font-medium transition-all ${
                          !day ? "invisible"
                          : isDisabled(day) ? "text-muted-foreground opacity-30 cursor-not-allowed"
                          : selectedDate === dateStr(day) ? "bg-primary text-white"
                          : "hover:bg-violet-50 hover:text-primary"
                        }`}>
                        {day}
                      </motion.button>
                    ))}
                  </div>

                  {/* Time slots */}
                  <AnimatePresence>
                    {selectedDate && (
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 pt-5 border-t border-border">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                          {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </p>

                        {slotsLoading ? (
                          <div className="grid grid-cols-3 gap-2">
                            {[1,2,3,4,5,6].map(i => <div key={i} className="h-9 bg-secondary rounded-lg animate-pulse" />)}
                          </div>
                        ) : slots.length === 0 ? (
                          <p className="text-sm text-muted-foreground italic">No slots available on this day.</p>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            {slots.map(t => (
                              <motion.button key={t} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedTime(t)}
                                className={`text-xs font-semibold py-2.5 rounded-lg border transition-all ${
                                  selectedTime === t ? "bg-primary text-white border-primary" : "border-border hover:border-primary hover:text-primary"
                                }`}>
                                {formatTime(t)}
                              </motion.button>
                            ))}
                          </div>
                        )}

                        {selectedTime && (
                          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => setStep("form")}
                            className="w-full mt-4 bg-primary text-white font-bold py-3 rounded-xl hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 group">
                            Confirm time — {formatTime(selectedTime)}
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Form ── */}
            {step === "form" && (
              <motion.div key="form" variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden max-w-lg mx-auto w-full">
                <div className="bg-primary px-7 py-5 text-white">
                  <button onClick={() => setStep("calendar")} className="flex items-center gap-1 text-violet-200 text-xs font-semibold mb-3 hover:text-white transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <h2 className="font-extrabold text-xl" style={{ fontFamily: "'Instrument Serif', serif" }}>{eventInfo.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-xs text-violet-200">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{eventInfo.duration} min</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedDate! + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {formatTime(selectedTime!)}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleBook} className="p-7 flex flex-col gap-4">
                  {formError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{formError}</div>}

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Your name</label>
                    <input required value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Alex Chen"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background" />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Email address</label>
                    <input required type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="alex@example.com"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background" />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Notes (optional)</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                      placeholder="Anything the host should know beforehand?"
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background resize-none" />
                  </div>

                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={submitting}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-1 group">
                    {submitting ? "Booking…" : <><Check className="w-4 h-4" /> Confirm booking</>}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ── Step 3: Confirmed ── */}
            {step === "confirmed" && (
              <motion.div key="confirmed" variants={fadeUp} initial="hidden" animate="visible"
                className="bg-white rounded-2xl shadow-xl border border-border p-12 text-center max-w-md mx-auto w-full">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>You're booked!</h2>
                <p className="text-muted-foreground text-sm mb-6">A confirmation has been sent to <span className="font-semibold text-foreground">{guestEmail}</span>.</p>

                <div className="bg-background border border-border rounded-xl p-5 text-left mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Meeting details</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{new Date(selectedDate! + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{formatTime(selectedTime!)} · {eventInfo.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>with {eventInfo.user}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">Powered by <span className="font-bold">Cally</span></p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
