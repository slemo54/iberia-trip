import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { trip, quickLinks } from "./data/itinerary";

// Custom marker icons per region
const makeIcon = (color) => L.divIcon({
  className: "custom-marker",
  html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 2px ${color}55,0 2px 8px rgba(0,0,0,0.5)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const regionColor = {
  alvor: "#7dd3fc",
  lisbona: "#a78bfa",
  siviglia: "#fb923c",
};

const allPoints = [
  ...trip.stays.map((s) => ({
    id: s.id, type: "stay", name: s.name, city: s.city,
    coords: s.coords, region: s.id, dates: s.dates,
  })),
  { id: "amado", type: "surf", name: "Praia do Amado", region: "alvor",
    coords: { lat: 37.165, lng: -8.875 } },
  { id: "carcavelos", type: "surf", name: "Carcavelos", region: "lisbona",
    coords: { lat: 38.680, lng: -9.336 } },
  { id: "caparica", type: "surf", name: "Costa de Caparica", region: "lisbona",
    coords: { lat: 38.633, lng: -9.235 } },
  { id: "guincho", type: "surf", name: "Guincho", region: "lisbona",
    coords: { lat: 38.730, lng: -9.473 } },
  { id: "sevilla_airport", type: "airport", name: "Aeropuerto Sevilla", region: "siviglia",
    coords: { lat: 37.4180, lng: -5.8932 } },
];

// Itinerario come polyline
const route = [
  { lat: 37.4180, lng: -5.8932, label: "Siviglia apt" },
  ...trip.stays.map((s) => ({ ...s.coords, label: s.name })),
];

// Stima drive: distanza haversine + 30% correzione strade, speed media 90 km/h
function haversine(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const sa = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(sa));
}

function legEta(a, b) {
  const km = haversine(a, b) * 1.3;
  const h = km / 90;
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return { km: Math.round(km), eta: `${hh}h ${mm}m` };
}

export default function MapView() {
  const center = [38.0, -8.0];
  const etas = useMemo(() => {
    const legs = [];
    for (let i = 0; i < route.length - 1; i++) {
      legs.push({ from: route[i].label, to: route[i+1].label, ...legEta(route[i], route[i+1]) });
    }
    return legs;
  }, []);

  return (
    <section className="map-view">
      <h2 className="section-title">📍 Mappa viaggio</h2>

      <div className="map-wrap">
        <MapContainer
          center={center}
          zoom={7}
          scrollWheelZoom={true}
          className="leaflet-container"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={20}
          />

          <Polyline
            positions={route.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: "#a78bfa",
              weight: 3,
              opacity: 0.7,
              dashArray: "6 8",
            }}
          />

          {allPoints.map((p) => (
            <Marker
              key={p.id}
              position={[p.coords.lat, p.coords.lng]}
              icon={makeIcon(p.type === "surf" ? "#06b6d4" : p.type === "airport" ? "#fbbf24" : regionColor[p.region])}
            >
              <Popup>
                <strong>{p.name}</strong>
                {p.city && <div style={{ fontSize: 11, opacity: 0.7 }}>{p.city}</div>}
                {p.dates && <div style={{ fontSize: 11 }}>{p.dates}</div>}
                <a
                  href={`https://maps.google.com/?q=${p.coords.lat},${p.coords.lng}`}
                  target="_blank" rel="noreferrer"
                  style={{ fontSize: 11, color: "#7c3aed" }}
                >
                  Apri in Google Maps →
                </a>
              </Popup>
            </Marker>
          ))}

          {/* Punto partenza/aeroporto */}
          <CircleMarker
            center={[37.4180, -5.8932]}
            radius={6}
            pathOptions={{ color: "#fbbf24", fillColor: "#fbbf24", fillOpacity: 0.7 }}
          />
        </MapContainer>
      </div>

      <h3 className="map-eta-title">⏱️ Tratte in auto</h3>
      <ul className="eta-list">
        {etas.map((e, i) => (
          <li key={i}>
            <div className="eta-from-to">
              <span>{e.from}</span>
              <span className="eta-arrow">→</span>
              <span>{e.to}</span>
            </div>
            <div className="eta-meta">
              <strong>{e.eta}</strong> · {e.km} km
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
