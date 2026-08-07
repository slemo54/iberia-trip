import { lazy, Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane, Car, Umbrella, Moon, Utensils, Footprints, Camera,
  MapPin, Beer, Waves, Star, Phone, Navigation, Heart, Globe,
  ChevronRight, Sun, Sunrise, Sunset, Cloud, Wind, Droplets,
  Sparkles, Calendar, Share2, ListChecks, Map as MapIcon, Save,
} from "lucide-react";
import { trip, quickLinks } from "./data/itinerary";
import { LangProvider, useLang } from "./i18n";
import { FavProvider, useFav } from "./favs";
import { tripProgress } from "./trip";
import { sunTimes, formatTime } from "./sun";
import { fetchWeather, describeCode } from "./weather";
import SurfView from "./Surf";
import Checklist from "./Checklist";
import Backup from "./Backup";

// Lazy-load the map to keep initial bundle small
const MapView = lazy(() => import("./MapView"));
import "./app.css";

const iconFor = (type) => {
  switch (type) {
    case "plane": return Plane;
    case "car": return Car;
    case "umbrella": return Umbrella;
    case "moon": return Moon;
    case "utensils": return Utensils;
    case "footprints": return Footprints;
    case "camera": return Camera;
    case "map-pin": return MapPin;
    case "beer": return Beer;
    case "wave": return Waves;
    case "surf": return Waves;
    case "walk": return Footprints;
    case "transit": return Car;
    case "beach": return Umbrella;
    case "food": return Utensils;
    case "night": return Moon;
    case "sight": return Camera;
    case "drinks": return Beer;
    case "alt": return MapPin;
    default: return MapPin;
  }
};

const regionMeta = {
  alvor: { color: "#7dd3fc", label: "Algarve", city: "Alvor" },
  lisbona: { color: "#a78bfa", label: "Lisbona", city: "Lisbona" },
  siviglia: { color: "#fb923c", label: "Siviglia", city: "Siviglia" },
};

const coordsByRegion = {
  alvor: { lat: 37.1296, lng: -8.5917 },
  lisbona: { lat: 38.7115, lng: -9.1310 },
  siviglia: { lat: 37.3929, lng: -5.9936 },
};

function useWeather(region) {
  const [w, setW] = useState(null);
  useEffect(() => {
    const c = coordsByRegion[region];
    if (!c) return;
    let cancel = false;
    fetchWeather(c.lat, c.lng, trip.meta.start, trip.meta.end).then((d) => {
      if (!cancel) setW(d);
    });
    return () => { cancel = true; };
  }, [region]);
  return w;
}

function WeatherStrip({ region, date }) {
  const w = useWeather(region);
  if (!w) return null;
  const day = w.days.find((d) => d.date === date);
  if (!day) return null;
  const d = describeCode(day.code);
  return (
    <div className="weather-strip" title={`${d.label} · vento ${Math.round(day.wind)} km/h`}>
      <span className="w-icon">{d.icon}</span>
      <span className="w-temp">{Math.round(day.tmax)}°/{Math.round(day.tmin)}°</span>
      {day.pop > 20 && (
        <span className="w-pop" title={`Prob. pioggia ${day.pop}%`}>
          <Droplets size={11} /> {day.pop}%
        </span>
      )}
    </div>
  );
}

function SunStrip({ region, date }) {
  const [sun, setSun] = useState(null);
  useEffect(() => {
    const c = coordsByRegion[region];
    if (!c) return;
    setSun(sunTimes(new Date(date), c.lat, c.lng));
  }, [region, date]);
  if (!sun) return null;
  return (
    <div className="sun-strip">
      <span title="Alba"><Sunrise size={12} /> {formatTime(sun.sunrise)}</span>
      <span title="Tramonto"><Sunset size={12} /> {formatTime(sun.sunset)}</span>
    </div>
  );
}

function TripHeader() {
  const { t } = useLang();
  const [p, setP] = useState(() => tripProgress());
  useEffect(() => {
    const id = setInterval(() => setP(tripProgress()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (p.phase === "before") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="trip-header before"
      >
        <div className="th-main">
          <span className="th-emoji">✈️</span>
          <div>
            <div className="th-title">{trip.meta.title}</div>
            <div className="th-sub">
              {p.daysUntil === 1 ? "Manca 1 giorno" : `Mancano ${p.daysUntil} giorni`}
            </div>
          </div>
        </div>
        <div className="th-bar"><div className="th-fill" style={{ width: "0%" }} /></div>
      </motion.div>
    );
  }
  if (p.phase === "after") {
    return (
      <div className="trip-header after">
        <div className="th-main">
          <span className="th-emoji">🌅</span>
          <div>
            <div className="th-title">Viaggio concluso</div>
            <div className="th-sub">Da {p.daysSince} {p.daysSince === 1 ? "giorno" : "giorni"}</div>
          </div>
        </div>
      </div>
    );
  }
  const day = trip.days[p.currentDayIdx];
  return (
    <motion.div
      key={day.id}
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className="trip-header during"
    >
      <div className="th-main">
        <span className="th-emoji">📍</span>
        <div>
          <div className="th-title">Giorno {p.currentDayIdx + 1} di {trip.days.length}</div>
          <div className="th-sub">{day.title}</div>
        </div>
      </div>
      <div className="th-bar">
        <div className="th-fill" style={{ width: `${Math.round(p.progress * 100)}%` }} />
      </div>
    </motion.div>
  );
}

function TopBar() {
  const { lang, setLang, t } = useLang();
  const langs = ["it", "en", "pt"];
  return (
    <header className="topbar">
      <div className="brand">
        <Sun size={18} className="brand-icon" />
        <span>{trip.meta.title}</span>
      </div>
      <div className="topbar-right">
        <button
          className="icon-btn"
          onClick={() => window.dispatchEvent(new CustomEvent("iberia:open-menu"))}
          aria-label="Altro"
          title="Checklist & backup"
        >
          <ListChecks size={16} />
        </button>
        <div className="lang-switch" role="tablist" aria-label={t("language")}>
          {langs.map((l) => (
            <button
              key={l}
              role="tab"
              aria-selected={lang === l}
              className={lang === l ? "on" : ""}
              onClick={() => setLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function DayCard({ day, idx, isToday }) {
  const { t } = useLang();
  const { has, toggle } = useFav();
  const fav = has(day.id);
  const meta = regionMeta[day.region] || { color: "#a78bfa", label: "", city: "" };

  const share = async () => {
    const txt = `${day.weekday} ${day.date.slice(8)} Ago · ${day.title}\n${day.summary}\n\n` +
      day.blocks.map((b) => `• ${b.text}`).join("\n");
    if (navigator.share) {
      try {
        await navigator.share({ title: `Iberia · ${day.title}`, text: txt });
      } catch {} // user cancel
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(txt);
      // eslint-disable-next-line no-alert
      alert("Copiato negli appunti");
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04 }}
      className={`day-card ${isToday ? "is-today" : ""}`}
      style={{ "--accent": meta.color }}
    >
      <div className="day-head">
        <div className="day-date">
          <span className="wd">{day.weekday}</span>
          <span className="num">{day.date.slice(8)}</span>
        </div>
        <div className="day-title">
          <h3>{day.title}</h3>
          <p>{day.summary}</p>
        </div>
        <div className="day-actions">
          <button
            className="share-btn"
            onClick={share}
            aria-label="Condividi giorno"
            title="Condividi"
          >
            <Share2 size={15} />
          </button>
          <button
            className={`fav-btn ${fav ? "on" : ""}`}
            onClick={() => toggle(day.id)}
            aria-label={fav ? t("removeFav") : t("addFav")}
          >
            <Heart size={18} fill={fav ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="meta-row">
        <div className="region-tag" style={{ background: `${meta.color}22`, color: meta.color, borderColor: `${meta.color}55` }}>
          {meta.label}
        </div>
        <SunStrip region={day.region} date={day.date} />
        <WeatherStrip region={day.region} date={day.date} />
      </div>

      <ul className="blocks">
        {day.blocks.map((b, i) => {
          const Icon = iconFor(b.icon || b.type);
          return (
            <li key={i} className={`block block-${b.type}`}>
              <span className="block-icon"><Icon size={16} /></span>
              <span className="block-text">{b.text}</span>
            </li>
          );
        })}
      </ul>
    </motion.article>
  );
}

function StayCard({ stay, isCurrent }) {
  const { t } = useLang();
  return (
    <article className={`stay-card ${isCurrent ? "is-current" : ""}`}>
      <div className="stay-head">
        <div>
          <h3>{stay.name}</h3>
          <p className="muted">{stay.city}</p>
        </div>
        <span className="dates">{stay.dates}</span>
      </div>

      <a className="btn btn-primary" href={`https://maps.google.com/?q=${encodeURIComponent(stay.address)}`} target="_blank" rel="noreferrer">
        <Navigation size={16} /> {t("openMaps")}
      </a>

      {stay.keys && (
        <div className="key-grid">
          <div className="key-pill"><span>{t("keys")}</span><strong>{stay.keys.box}</strong></div>
          <div className="key-pill"><span>{t("parking")}</span><strong>{stay.keys.parking}</strong></div>
          <div className="key-pill"><span>{t("pool")}</span><strong>{stay.keys.pool}</strong></div>
        </div>
      )}

      {stay.host && (
        <a className="btn btn-ghost" href={`tel:${stay.host.phone.replace(/\s/g, "")}`}>
          <Phone size={16} /> {stay.host.name} · {stay.host.phone}
        </a>
      )}
    </article>
  );
}

function QuickLinks() {
  const { t } = useLang();
  const groups = [
    { title: t("surf"), items: [
      { label: "Praia do Amado", href: quickLinks.surfing.amado },
      { label: "Carcavelos", href: quickLinks.surfing.carcavelos },
      { label: "Costa de Caparica", href: quickLinks.surfing.caparica },
    ]},
    { title: t("night"), items: [
      { label: "The Strip · Albufeira", href: quickLinks.nightlife.alb_strip },
      { label: "Bairro Alto · Lisbona", href: quickLinks.nightlife.bairro_alto },
      { label: "Ministerium", href: quickLinks.nightlife.ministerium },
      { label: "Calle Betis · Triana", href: quickLinks.nightlife.calle_betis },
    ]},
    { title: t("food"), items: [
      { label: "100 Montaditos", href: quickLinks.food.montaditos },
      { label: "Tasca do Dias", href: quickLinks.food.tasca_dias },
      { label: "Vuela Tapas", href: quickLinks.food.vuela },
      { label: "El Librero", href: quickLinks.food.el_librero },
    ]},
  ];

  return (
    <section className="quicklinks">
      <h2 className="section-title"><Globe size={16} /> {t("quickLinks")}</h2>
      <div className="ql-groups">
        {groups.map((g) => (
          <div key={g.title} className="ql-group">
            <h4>{g.title}</h4>
            <div className="ql-items">
              {g.items.map((it) => (
                <a key={it.label} className="chip" href={it.href} target="_blank" rel="noreferrer">
                  {it.label}
                  <ChevronRight size={14} />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Tabs({ view, setView }) {
  const { t } = useLang();
  return (
    <nav className="tabs tabs-6" role="tablist">
      <button role="tab" aria-selected={view === "timeline"} className={view === "timeline" ? "on" : ""} onClick={() => setView("timeline")}>
        <span className="emoji" aria-hidden>🗓️</span> {t("day")}
      </button>
      <button role="tab" aria-selected={view === "stays"} className={view === "stays" ? "on" : ""} onClick={() => setView("stays")}>
        <span className="emoji" aria-hidden>🛏️</span> {t("address")}
      </button>
      <button role="tab" aria-selected={view === "surf"} className={view === "surf" ? "on" : ""} onClick={() => setView("surf")}>
        <Waves size={14} /> Surf
      </button>
      <button role="tab" aria-selected={view === "map"} className={view === "map" ? "on" : ""} onClick={() => setView("map")}>
        <MapIcon size={14} /> Mappa
      </button>
      <button role="tab" aria-selected={view === "links"} className={view === "links" ? "on" : ""} onClick={() => setView("links")}>
        <span className="emoji" aria-hidden>⚡</span> {t("quickLinks")}
      </button>
      <button role="tab" aria-selected={view === "favs"} className={view === "favs" ? "on" : ""} onClick={() => setView("favs")}>
        <Heart size={14} /> {t("favorites")}
      </button>
    </nav>
  );
}

function MenuSheet({ open, onClose, goTo }) {
  if (!open) return null;
  return (
    <motion.div
      className="sheet-backdrop"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="sheet"
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 24, stiffness: 240 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" />
        <h3>Strumenti</h3>
        <button className="sheet-item" onClick={() => { goTo("check"); onClose(); }}>
          <ListChecks size={18} /> Checklist pre-partenza
        </button>
        <button className="sheet-item" onClick={() => { goTo("backup"); onClose(); }}>
          <Save size={18} /> Backup & ripristino
        </button>
      </motion.div>
    </motion.div>
  );
}

function Timeline() {
  const { t } = useLang();
  const { favs } = useFav();
  const [filter, setFilter] = useState("all");
  const p = tripProgress();
  const todayId = p.phase === "during" ? trip.days[p.currentDayIdx].id : null;

  const days = trip.days.filter((d) => {
    if (filter === "favs") return favs.has(d.id);
    if (filter === "today") return todayId === d.id;
    return true;
  });

  return (
    <div className="timeline">
      <div className="filter-row">
        <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>Tutto</button>
        {todayId && (
          <button className={filter === "today" ? "on" : ""} onClick={() => setFilter("today")}>
            <Sparkles size={12} /> {t("today")}
          </button>
        )}
        <button className={filter === "favs" ? "on" : ""} onClick={() => setFilter("favs")}>
          <Heart size={12} /> {t("favorites")}
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {days.map((d, i) => (
          <DayCard key={d.id} day={d} idx={i} isToday={todayId === d.id} />
        ))}
      </AnimatePresence>

      {days.length === 0 && (
        <p className="empty">Nessun preferito ancora. Tocca ❤️ su un giorno per salvarlo.</p>
      )}
    </div>
  );
}

function Stays() {
  const now = new Date();
  const current = trip.stays.find((s) => {
    const m = s.dates.match(/(\d+).+(\d+)/);
    if (!m) return false;
    const startDate = new Date(`2026-08-${String(parseInt(m[1])).padStart(2, "0")}`);
    const endDate = new Date(`2026-08-${String(parseInt(m[2])).padStart(2, "0")}T23:59`);
    return now >= startDate && now <= endDate;
  });

  return (
    <div className="stays">
      {trip.stays.map((s) => (
        <StayCard key={s.id} stay={s} isCurrent={current && current.id === s.id} />
      ))}
    </div>
  );
}

function Favs() {
  const { favs, toggle } = useFav();
  const days = trip.days.filter((d) => favs.has(d.id));
  return (
    <div className="favs-view">
      {days.length === 0 ? (
        <p className="empty">Nessun preferito. Vai su 🗓️ e tocca ❤️ per salvare un giorno.</p>
      ) : (
        days.map((d) => (
          <div key={d.id} className="fav-row">
            <span><strong>{d.weekday} {d.date.slice(8)}</strong> · {d.title}</span>
            <button onClick={() => toggle(d.id)} aria-label="Rimuovi">
              <Heart size={16} fill="currentColor" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

function App() {
  const [view, setView] = useState("timeline");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const open = () => setMenuOpen(true);
    window.addEventListener("iberia:open-menu", open);
    return () => window.removeEventListener("iberia:open-menu", open);
  }, []);

  return (
    <LangProvider>
      <FavProvider>
        <div className="app">
          <div className="bg-gradient" aria-hidden />
          <div className="bg-grid" aria-hidden />

          <TopBar />
          <TripHeader />

          <main className="main">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {view === "timeline" && <Timeline />}
                {view === "stays" && <Stays />}
                {view === "surf" && <SurfView />}
                {view === "map" && (
                  <Suspense fallback={<div className="map-loading">Caricamento mappa…</div>}>
                    <MapView />
                  </Suspense>
                )}
                {view === "links" && <QuickLinks />}
                {view === "check" && <Checklist />}
                {view === "backup" && <Backup />}
                {view === "favs" && <Favs />}
              </motion.div>
            </AnimatePresence>
          </main>

          <Tabs view={view} setView={setView} />

          <AnimatePresence>
            {menuOpen && (
              <MenuSheet
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                goTo={setView}
              />
            )}
          </AnimatePresence>
        </div>
      </FavProvider>
    </LangProvider>
  );
}

export default App;
