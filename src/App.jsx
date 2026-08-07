import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Car,
  Umbrella,
  Moon,
  Utensils,
  Footprints,
  Camera,
  MapPin,
  Beer,
  Waves,
  Star,
  Phone,
  Navigation,
  Heart,
  Globe,
  ChevronRight,
  ChevronLeft,
  Sun,
} from "lucide-react";
import { trip, quickLinks } from "./data/itinerary";
import { LangProvider, useLang } from "./i18n";
import { FavProvider, useFav } from "./favs";
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
  alvor: { color: "#7dd3fc", label: "Algarve" },
  lisbona: { color: "#a78bfa", label: "Lisbona" },
  siviglia: { color: "#fb923c", label: "Siviglia" },
};

const todayIdx = () => {
  const now = new Date();
  const start = new Date(trip.meta.start);
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  if (diff < 0 || diff > trip.days.length - 1) return null;
  return diff;
};

function TopBar() {
  const { lang, setLang, t } = useLang();
  const langs = ["it", "en", "pt"];
  return (
    <header className="topbar">
      <div className="brand">
        <Sun size={18} className="brand-icon" />
        <span>{trip.meta.title}</span>
      </div>
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
    </header>
  );
}

function DayCard({ day, idx, isToday }) {
  const { t } = useLang();
  const { has, toggle } = useFav();
  const fav = has(day.id);
  const meta = regionMeta[day.region] || { color: "#a78bfa", label: "" };

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
        <button
          className={`fav-btn ${fav ? "on" : ""}`}
          onClick={() => toggle(day.id)}
          aria-label={fav ? t("removeFav") : t("addFav")}
        >
          <Heart size={18} fill={fav ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="region-tag" style={{ background: `${meta.color}22`, color: meta.color, borderColor: `${meta.color}55` }}>
        {meta.label}
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
    <nav className="tabs" role="tablist">
      <button role="tab" aria-selected={view === "timeline"} className={view === "timeline" ? "on" : ""} onClick={() => setView("timeline")}>
        <span className="emoji" aria-hidden>🗓️</span> {t("day")}
      </button>
      <button role="tab" aria-selected={view === "stays"} className={view === "stays" ? "on" : ""} onClick={() => setView("stays")}>
        <span className="emoji" aria-hidden>🛏️</span> {t("address")}
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

function Timeline() {
  const { t } = useLang();
  const { favs } = useFav();
  const [filter, setFilter] = useState("all"); // all | today | favs
  const idx = todayIdx();

  const days = trip.days.filter((d) => {
    if (filter === "favs") return favs.has(d.id);
    if (filter === "today") return idx !== null && trip.days[idx].id === d.id;
    return true;
  });

  return (
    <div className="timeline">
      <div className="filter-row">
        <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>Tutto</button>
        {idx !== null && (
          <button className={filter === "today" ? "on" : ""} onClick={() => setFilter("today")}>{t("today")}</button>
        )}
        <button className={filter === "favs" ? "on" : ""} onClick={() => setFilter("favs")}>
          <Heart size={12} /> {t("favorites")}
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {days.map((d, i) => (
          <DayCard key={d.id} day={d} idx={i} isToday={idx !== null && trip.days[idx].id === d.id} />
        ))}
      </AnimatePresence>

      {days.length === 0 && (
        <p className="empty">Nessun preferito ancora. Tocca ❤️ su un giorno per salvarlo.</p>
      )}
    </div>
  );
}

function Stays() {
  const idx = todayIdx();
  // Heuristic: current stay = first stay whose date range includes today
  const now = new Date();
  const current = trip.stays.find((s) => {
    const m = s.dates.match(/(\d+).+(\d+)/);
    if (!m) return false;
    const startDay = parseInt(m[1]);
    const endDay = parseInt(m[2]);
    const startDate = new Date(`2026-08-${String(startDay).padStart(2, "0")}`);
    const endDate = new Date(`2026-08-${String(endDay).padStart(2, "0")}T23:59`);
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

  return (
    <LangProvider>
      <FavProvider>
        <div className="app">
          <div className="bg-gradient" aria-hidden />
          <div className="bg-grid" aria-hidden />

          <TopBar />

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
                {view === "links" && <QuickLinks />}
                {view === "favs" && <Favs />}
              </motion.div>
            </AnimatePresence>
          </main>

          <Tabs view={view} setView={setView} />
        </div>
      </FavProvider>
    </LangProvider>
  );
}

export default App;
