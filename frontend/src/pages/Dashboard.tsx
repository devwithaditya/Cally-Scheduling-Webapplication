import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Clock, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  LogOut, User, Check, X, Copy, ChevronDown,Search,
  Mail,
  BookOpen,
  ChevronRight,
  Video,
  Loader2
} from "lucide-react";
import { fadeUp } from "../shared";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import logo from "../images/logo1.webp";
// ── types ────────────────────────────────────────────────────────────────────
interface Event { _id: string; title: string; duration: number; description: string; color: string; slug: string; isActive: boolean; }
type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
const DAYS: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const COLORS = ["#7C3AED", "#0891B2", "#059669", "#DC2626", "#D97706", "#DB2777", "#2563EB"];
const TIMEZONES = ["UTC", "America/New_York", "America/Chicago", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Tokyo", "Asia/Kolkata", "Australia/Sydney"];

// ── Dashboard ────────────────────────────────────────────────────────────────
export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<"events" | "availability" | "bookings" |"profile">("events");

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Sidebar */}
      <div className="flex">
        <aside className="hidden md:flex w-60 min-h-screen bg-white border-r border-border flex-col fixed top-0 left-0 z-30">
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <img
              src={logo}
              alt="Cally"
              className="w-10 h-11 object-contain"
            />
          
            <span
              className="text-3xl font-semibold leading-none"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Cally
            </span>
          </div>

          <nav className="flex-1 p-4 flex flex-col gap-1">
            {([
              { id: "events",       icon: Calendar, label: "Events" },
              { id: "bookings",     icon: BookOpen, label: "Bookings" },
              { id: "availability", icon: Clock,    label: "Availability" },
              { id: "profile",      icon: User,     label: "Profile" },
            ] as const).map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === id ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            {user && (
              <div className="flex items-center gap-3 px-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{user.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            )}
            <button onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all">
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-border px-4 h-14 flex items-center justify-between">
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
          <div className="flex gap-1">
            {([
              { id: "events", icon: Calendar },
              { id: "bookings", icon: BookOpen, label: "Bookings" },
              { id: "availability", icon: Clock },
              { id: "profile", icon: User },
            ] as const).map(({ id, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`p-2 rounded-lg transition-all ${tab === id ? "bg-primary text-white" : "text-muted-foreground"}`}>
                <Icon className="w-4 h-4" />
              </button>
            ))}
            <button onClick={handleLogout} className="p-2 rounded-lg text-muted-foreground hover:text-red-500 transition-all ml-1">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 md:ml-60 pt-14 md:pt-0 min-h-screen">
          <AnimatePresence mode="wait">
            {tab === "events"       && <EventsTab key="events" />}
             {tab === "bookings" && <BookingsTab key="bookings" />}
            {tab === "availability" && <AvailabilityTab key="availability" />}
            {tab === "profile"      && <ProfileTab key="profile" user={user} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ── Bookings Tab ─────────────────────────────────────────────────────────────
interface Booking {
  _id: string;
  guestName: string;
  guestEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  status: "confirmed" | "cancelled";
  event: { title: string; duration: number; color?: string; };
  meetLink?: string;
}


function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function fmt12(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function BookingsTab() {
  const [filter, setFilter]     = useState<"upcoming" | "past" | "all">("upcoming");
  const [search, setSearch]     = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
useEffect(() => {
  async function loadBookings() {
    try {
      setLoading(true);
      
      const res = await api.get("/bookings");
      console.log(res.data.bookings);
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  loadBookings();
}, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        Loading bookings...
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const filtered = bookings.filter(b => {
    const isUpcoming = b.date >= today;
    if (filter === "upcoming" && !isUpcoming) return false;
    if (filter === "past"     &&  isUpcoming) return false;
    if (search) {
      const q = search.toLowerCase();
      return b.guestName.toLowerCase().includes(q) || b.guestEmail.toLowerCase().includes(q) || b.event.title.toLowerCase().includes(q);
    }
    return true;
  });

  // Group by date
  const groups = filtered.reduce<Record<string, Booking[]>>((acc, b) => {
    if (!acc[b.date]) acc[b.date] = [];
    acc[b.date].push(b);
    return acc;
  }, {});
  const sortedDates = Object.keys(groups).sort((a, b) => filter === "past" ? b.localeCompare(a) : a.localeCompare(b));

  const upcoming = bookings.filter(b => b.date >= today && b.status === "confirmed").length;
  const past     = bookings.filter(b => b.date <  today).length;
  
  const handleCancelBooking = async (bookingId: string) => {
    if (cancelling) return;
  
    try {
      setCancelling(true);
  
      await api.delete(`/bookings/${bookingId}`);
  
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );
  
      if (selected && selected._id === bookingId) {
        setSelected({
          ...selected,
          status: "cancelled",
        });
      }
  
      alert("Booking cancelled successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="p-6 md:p-10 max-w-5xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold" style={{ fontFamily: "'Instrument Serif', serif" }}>Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">All meetings scheduled through your Cally links.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: "Upcoming",  value: upcoming, color: "text-primary",    bg: "bg-violet-50  border-violet-100" },
          { label: "Past",      value: past,     color: "text-foreground", bg: "bg-white      border-border" },
          { label: "Total",     value: bookings.length, color: "text-foreground", bg: "bg-white border-border" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} border rounded-2xl px-5 py-4 text-center`}>
            <p className={`text-2xl font-extrabold ${color}`} style={{ fontFamily: "'Instrument Serif', serif" }}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="inline-flex items-center bg-white border border-border rounded-xl p-1 gap-1">
          {(["upcoming", "past", "all"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${
                filter === f ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or event…"
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-white" />
        </div>
      </div>

      {/* Booking list */}
      {sortedDates.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-border">
          <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-bold text-lg mb-1">No bookings found</p>
          <p className="text-sm text-muted-foreground">
            {filter === "upcoming" ? "Share your booking link to start receiving meetings." : "No past meetings match your search."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {sortedDates.map(date => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{formatDate(date)}</p>
                <div className="flex-1 h-px bg-border" />
                {date === today && (
                  <span className="text-xs font-bold text-primary bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">Today</span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                {groups[date].map((booking, i) => (
                  <motion.div key={booking._id}
                    variants={fadeUp} custom={i}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelected(booking)}
                    className={`bg-white border border-border rounded-2xl px-5 py-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all ${
                      booking.status === "cancelled" ? "opacity-50" : ""
                    }`}>
                    {/* Color bar */}
                    <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: booking.event.color }} />

                    {/* Time */}
                    <div className="w-24 flex-shrink-0 text-center">
                      <p className="text-sm font-bold">{fmt12(booking.startTime)}</p>
                      <p className="text-xs text-muted-foreground">{fmt12(booking.endTime)}</p>
                    </div>

                    <div className="w-px h-10 bg-border flex-shrink-0" />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-sm truncate">{booking.guestName}</p>
                        {booking.status === "cancelled" && (
                          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full flex-shrink-0">Cancelled</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{booking.event.title} · {booking.event.duration} min</p>
                      {booking.notes && <p className="text-xs text-muted-foreground/70 truncate mt-0.5 italic">"{booking.notes}"</p>}
                    </div>

                    {/* Email */}
                    <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{booking.guestEmail}</span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={e => e.stopPropagation()}>

              {/* Header strip */}
              <div className="h-2 w-full" style={{ backgroundColor: selected.event.color }} />
              <div className="p-7">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      selected.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}>
                      {selected.status === "confirmed" ? "✓ Confirmed" : "✗ Cancelled"}
                    </span>
                    <h2 className="text-xl font-extrabold mt-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      {selected.event.title}
                    </h2>
                  </div>
                  <button onClick={() => setSelected(null)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{selected.guestName}</p>
                      <p className="text-xs text-muted-foreground">{selected.guestEmail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p>{formatDate(selected.date)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p>{fmt12(selected.startTime)} – {fmt12(selected.endTime)} · {selected.event.duration} min</p>
                  </div>

                 <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-4 h-4 text-muted-foreground" />
                  </div>
                
                  <div className="flex-1">
                    <p className="font-medium">Google Meet</p>
                
                    {selected.meetLink ? (
                      <>
                        <a
                          href={selected.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline break-all"
                        >
                          {selected.meetLink}
                        </a>
                
                        <a
                          href={selected.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                        >
                          Join Meeting
                        </a>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No meeting link available.
                      </p>
                    )}
                  </div>
                </div>

                  {selected.notes && (
                    <div className="mt-2 bg-background border border-border rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Guest notes</p>
                      <p className="text-sm text-foreground">{selected.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6 pt-5 border-t border-border">
                  <a href={`mailto:${selected.guestEmail}`}
                    className="flex-1 flex items-center justify-center gap-2 border border-border py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors">
                    <Mail className="w-4 h-4" /> Email guest
                  </a>
                  {selected.status === "confirmed" && (
                    <button
                      onClick={() => handleCancelBooking(selected._id)}
                      disabled={cancelling}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        cancelling
                          ? "bg-red-200 text-red-500 cursor-not-allowed"
                          : "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      {cancelling ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Cancel
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}



// ── Events Tab ───────────────────────────────────────────────────────────────
function EventsTab() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function fetchEvents() {
    try {
      const res = await api.get("/event-type");
      setEvents(res.data.events);
    } catch { /* backend unreachable in preview */ }
    setLoading(false);
  }

  useEffect(() => { fetchEvents(); }, []);

  function copyLink(slug: string) {
     const link = `${window.location.origin}/bookings/${user?.slug}/${slug}`;
     console.log("User slug:", user?.slug);
     console.log("Event slug:", slug);
    console.log("Generated Link:", link); 
    navigator.clipboard.writeText(link);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
    
  }

  async function toggleActive(ev: Event) {
    try { await api.put(`/events/${ev._id}`, { ...ev, isActive: !ev.isActive }); } catch { /* ignore */ }
    fetchEvents();
  }

  async function deleteEvent(id: string) {
    if (!confirm("Delete this event?")) return;
    try { await api.delete(`/event-type/${id}`); } catch { /* ignore */ }
    fetchEvents();
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="p-6 md:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: "'Instrument Serif', serif" }}>Event types</h1>
          <p className="text-sm text-muted-foreground mt-1">Create meeting types people can book with you.</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-violet-700 transition-colors">
          <Plus className="w-4 h-4" /> New event
        </motion.button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-2xl border border-border animate-pulse" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-border">
          <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
          <p className="font-bold text-lg mb-1">No events yet</p>
          <p className="text-sm text-muted-foreground mb-6">Create your first event type to start accepting bookings.</p>
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create event
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <motion.div key={ev._id} whileHover={{ y: -3 }}
              className={`bg-white border border-border rounded-2xl p-5 flex flex-col gap-3 ${!ev.isActive ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-8 rounded-full" style={{ backgroundColor: ev.color }} />
                  <div>
                    <p className="font-bold text-sm">{ev.title}</p>
                    <p className="text-xs text-muted-foreground">{ev.duration} min · /{ev.slug}</p>
                  </div>
                </div>
                <button onClick={() => toggleActive(ev)} className="text-muted-foreground hover:text-primary transition-colors">
                  {ev.isActive ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
              </div>

              {ev.description && <p className="text-xs text-muted-foreground line-clamp-2">{ev.description}</p>}

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button onClick={() => copyLink(ev.slug)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                  {copied === ev.slug ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === ev.slug ? "Copied!" : "Copy link"}
                </button>
                <div className="flex-1" />
                <button onClick={() => { setEditing(ev); setShowForm(true); }}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteEvent(ev._id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <EventForm event={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchEvents(); }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Event Form Modal ─────────────────────────────────────────────────────────
function EventForm({ event, onClose, onSaved }: { event: Event | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(event?.title ?? "");
  const [duration, setDuration] = useState(event?.duration ?? 30);
  const [description, setDescription] = useState(event?.description ?? "");
  const [color, setColor] = useState(event?.color ?? COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
try {
  const body = { title, duration, description, color };

  if (event) {
    await api.put(`/event-type/${event._id}`, {
      ...body,
      isActive: event.isActive,
    });
  } else {
    await api.post("/event-type", body);
  }

  onSaved();
} catch (err: any) {
  setError(err.message);
} finally {
  setLoading(false);
}
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-extrabold text-xl" style={{ fontFamily: "'Instrument Serif', serif" }}>
            {event ? "Edit event" : "New event type"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Event title</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="30-Minute Meeting"
              className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Duration (minutes)</label>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map(d => (
                <button key={d} type="button" onClick={() => setDuration(d)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    duration === d ? "bg-primary text-white border-primary" : "border-border hover:border-primary hover:text-primary"
                  }`}>
                  {d}m
                </button>
              ))}
            </div>
            <input type="number" min={5} max={480} value={duration} onChange={e => setDuration(Number(e.target.value))}
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background mt-2"
              placeholder="Custom duration" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Color</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-105"}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Description (optional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder="What is this meeting about?"
              className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-border py-3 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors">
              Cancel
            </button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-violet-700 transition-colors disabled:opacity-60">
              {loading ? "Saving…" : event ? "Save changes" : "Create event"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Availability Tab ─────────────────────────────────────────────────────────
function AvailabilityTab() {
  const emptySlots = () => DAYS.reduce((acc, d) => ({ ...acc, [d]: [] }), {} as Record<Day, { startTime: string; endTime: string }[]>);
  const [availability, setAvailability] = useState<Record<Day, { startTime: string; endTime: string }[]>>(emptySlots());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/availability")
      .then(async res => {
        if (res.data) {
          setAvailability({ ...emptySlots(), ...res.data.availability });
        }
      })
      .catch(() => { /* backend unreachable in preview */ })
      .finally(() => setLoading(false));
  }, []);

  function addSlot(day: Day) {
    setAvailability(prev => ({ ...prev, [day]: [...prev[day], { startTime: "09:00", endTime: "17:00" }] }));
  }

  function removeSlot(day: Day, idx: number) {
    setAvailability(prev => ({ ...prev, [day]: prev[day].filter((_, i) => i !== idx) }));
  }

  function updateSlot(day: Day, idx: number, field: "startTime" | "endTime", val: string) {
    setAvailability(prev => {
      const slots = [...prev[day]];
      slots[idx] = { ...slots[idx], [field]: val };
      return { ...prev, [day]: slots };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await api.put("/availability", { availability });
      if (res.data) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } catch { /* backend unreachable in preview */ }
    setSaving(false);
  }

  if (loading) return <div className="p-10"><div className="h-96 bg-white rounded-2xl border border-border animate-pulse" /></div>;

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="p-6 md:p-10 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: "'Instrument Serif', serif" }}>Availability</h1>
          <p className="text-sm text-muted-foreground mt-1">Set the hours you're open for bookings each week.</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving}
          className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-violet-700 transition-colors disabled:opacity-60">
          {saved ? <><Check className="w-4 h-4" />Saved!</> : saving ? "Saving…" : "Save changes"}
        </motion.button>
      </div>

      <div className="bg-white border border-border rounded-2xl divide-y divide-border overflow-hidden">
        {DAYS.map(day => (
          <div key={day} className="flex gap-4 px-5 py-4 items-start">
            <div className="w-28 flex-shrink-0 pt-1">
              <span className="text-sm font-bold">{day.slice(0, 3)}</span>
              <span className="text-xs text-muted-foreground ml-1">{day.slice(3)}</span>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {availability[day].length === 0 ? (
                <span className="text-sm text-muted-foreground italic pt-1">Unavailable</span>
              ) : (
                availability[day].map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input type="time" value={slot.startTime} onChange={e => updateSlot(day, idx, "startTime", e.target.value)}
                      className="border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background" />
                    <span className="text-muted-foreground text-sm">–</span>
                    <input type="time" value={slot.endTime} onChange={e => updateSlot(day, idx, "endTime", e.target.value)}
                      className="border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background" />
                    <button onClick={() => removeSlot(day, idx)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => addSlot(day)}
              className="flex-shrink-0 text-xs font-semibold text-primary hover:text-violet-700 transition-colors flex items-center gap-1 pt-1">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({ user }: { user: any }) {
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [timezone, setTimezone] = useState(user?.timezone ?? "UTC");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const { loadUser } = useAuth();

async function handleSave(e: React.FormEvent) {
  e.preventDefault();
  setError("");
  setSaving(true);

  try {
    const res = await api.put("/users/me", {
      username,
      bio,
      timezone,
    });

    console.log(res.data);

    await loadUser();

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  } catch (err: any) {
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setSaving(false);
  }
}

function connectCalendar() {
    const token = localStorage.getItem("accessToken");

    window.location.href =
      `${import.meta.env.VITE_API_URL}/auth/google/calendar?token=${token}`;
}

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="p-6 md:p-10 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold" style={{ fontFamily: "'Instrument Serif', serif" }}>Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">This info is shown on your public booking page.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">{error}</div>}

      <form onSubmit={handleSave} className="bg-white border border-border rounded-2xl p-7 flex flex-col gap-5">
        {/* Avatar placeholder */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-extrabold text-2xl">
            {username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Avatar upload coming soon</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Display name</label>
          <input value={username} onChange={e => setUsername(e.target.value)}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background" />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
            placeholder="Tell guests a little about yourself…"
            className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background resize-none" />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">Timezone</label>
          <div className="relative">
            <select value={timezone} onChange={e => setTimezone(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all bg-background appearance-none">
              {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        
        <div className="border border-border rounded-2xl p-5 bg-white">
          <div className="flex items-center justify-between">
        
            <div className="flex items-center gap-4">
        
              <img
                src="https://www.gstatic.com/images/branding/product/2x/calendar_96dp.png"
                className="w-10 h-10"
              />
        
              <div>
                <h3 className="font-bold">
                  Google Calendar
                </h3>
        
                <p className="text-sm text-muted-foreground">
                  {user?.calendarConnected
                    ? "Your Google Calendar is connected."
                    : "Connect your calendar to create events automatically."}
                </p>
              </div>
        
            </div>
        
            {user?.calendarConnected ? (
        
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200">
        
                <Check className="w-4 h-4" />
        
                Connected
        
              </div>
        
            ) : (
        
              <button
                type="button"
                onClick={connectCalendar}
                className="bg-primary text-white px-5 py-2 rounded-xl hover:bg-violet-700 transition"
              >
                Connect
              </button>
        
            )}
        
          </div>
        </div>

        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={saving}
          className="bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : saving ? "Saving…" : "Save profile"}
        </motion.button>
      </form>
    </motion.div>
  );
}
