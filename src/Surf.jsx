import { useState } from "react";
import { Waves, ExternalLink } from "lucide-react";
import { useLang } from "./i18n";

// Windy point forecast embed — no API key, free
const spots = [
  {
    id: "amado",
    name: "Praia do Amado",
    region: "alvor",
    coords: { lat: 37.165, lng: -8.875 },
    info: "Beach break, sabbia. Lavora meglio con swell ovest e marea media. Indicato per longboard.",
  },
  {
    id: "carcavelos",
    name: "Praia de Carcavelos",
    region: "lisbona",
    coords: { lat: 38.680, lng: -9.336 },
    info: "Reef + beach break affollato. Onde consistenti, vicino Lisbona (treno). Popolare per lezioni.",
  },
  {
    id: "caparica",
    name: "Costa de Caparica",
    region: "lisbona",
    coords: { lat: 38.633, lng: -9.235 },
    info: "Spiaggia lunghissima, beach break. Ottima per principianti, meno affollata a sud.",
  },
  {
    id: "guincho",
    name: "Praia do Guincho",
    region: "lisbona",
    coords: { lat: 38.730, lng: -9.473 },
    info: "Reef break potente, vento forte. Per surfisti esperti, vicino Cascais.",
  },
];

function WindyEmbed({ lat, lng }) {
  const src = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lng}&detailLat=${lat}&detailLon=${lng}&zoom=11&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=kmh&metricTemp=%C2%B0C&radarRange=-1`;
  return (
    <iframe
      title="Windy forecast"
      src={src}
      className="windy-frame"
      loading="lazy"
      allow="geolocation"
    />
  );
}

export default function SurfView() {
  const { t } = useLang();
  const [active, setActive] = useState(spots[0].id);
  const spot = spots.find((s) => s.id === active);

  return (
    <section className="surf-view">
      <h2 className="section-title"><Waves size={16} /> Surf forecast</h2>
      <p className="muted" style={{ marginTop: -8, fontSize: 12 }}>
        Dati vento e onde in tempo reale · fonte Windy/ECMWF
      </p>

      <div className="surf-tabs">
        {spots.map((s) => (
          <button
            key={s.id}
            className={active === s.id ? "on" : ""}
            onClick={() => setActive(s.id)}
          >
            {s.name.replace("Praia ", "").replace("Costa de ", "")}
          </button>
        ))}
      </div>

      <article className="surf-card">
        <h3>{spot.name}</h3>
        <p className="surf-info">{spot.info}</p>
        <div className="surf-meta">
          <span>📍 {spot.coords.lat.toFixed(2)}, {spot.coords.lng.toFixed(2)}</span>
          <a
            href={`https://www.windy.com/-${spot.coords.lat}/${spot.coords.lng}?wind`}
            target="_blank" rel="noreferrer"
            className="muted"
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            Apri Windy <ExternalLink size={12} />
          </a>
        </div>
        <WindyEmbed lat={spot.coords.lat} lng={spot.coords.lng} />
      </article>
    </section>
  );
}
