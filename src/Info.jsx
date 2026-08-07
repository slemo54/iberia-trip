import { Phone, Plane, AlertTriangle, Heart, Globe, Wallet } from "lucide-react";

const emergency = [
  { label: "Emergenza EU", number: "112", note: "Polizia, ambulanza, vigili del fuoco" },
  { label: "Polizia", number: "PSP (PT) 213 238 141", note: "Polícia de Segurança Pública" },
  { label: "Consolato IT Lisbona", number: "+351 213 009 400", note: "Emergenza cittadini italiani" },
  { label: "Consolato IT Madrid", number: "+34 917 230 387", note: "Per zona Siviglia" },
];

const taxis = [
  { label: "Taxi Lisbona", number: "+351 218 119 000", note: "Central radio taxi" },
  { label: "Taxi Siviglia", number: "+34 954 50 11 11", note: "Radio Taxi Sevilla" },
  { label: "Bolt / Uber", note: "App — disponibile Lisbona e Siviglia" },
];

const flight = {
  outbound: {
    label: "Andata",
    date: "Sab 8 Ago",
    airport: "Siviglia (SVQ)",
    arrival: "09:45",
    pickup: "Ritiro auto in aeroporto",
  },
  return: {
    label: "Ritorno",
    date: "Sab 15 Ago",
    airport: "Siviglia (SVQ)",
    departure: "10:25",
    pickup: "Consegna auto in aeroporto",
  },
};

const prices = [
  { item: "Caffè (espresso)", range: "€1–1.5" },
  { item: "Birra (33cl)", range: "€2–3" },
  { item: "Pasto medio (tapas)", range: "€12–18" },
  { item: "Cena ristorante", range: "€20–35" },
  { item: "Lezione surf 2h", range: "€35–50" },
  { item: "Noleggio tavola", range: "€15–25/gg" },
  { item: "Parcheggio spiaggia", range: "€0–5" },
  { item: "Benzina (1L)", range: "€1.65–1.80" },
];

function NumberRow({ label, number, note, href }) {
  return (
    <div className="info-row">
      <div className="info-row-text">
        <strong>{label}</strong>
        {note && <span className="muted">{note}</span>}
      </div>
      {number && (
        <a className="info-call" href={href || `tel:${number.replace(/[^\d+]/g, "")}`}>
          <Phone size={14} /> {number}
        </a>
      )}
    </div>
  );
}

export default function Info() {
  return (
    <section className="info-view">
      <h2 className="section-title">✈️ Volo</h2>
      <div className="info-grid">
        <div className="info-card">
          <div className="info-card-head">
            <span className="info-tag">ANDATA</span>
            <span className="info-date">{flight.outbound.date}</span>
          </div>
          <div className="info-big">{flight.outbound.arrival}</div>
          <div className="muted">Arrivo {flight.outbound.airport}</div>
          <div className="info-sub">{flight.outbound.pickup}</div>
        </div>
        <div className="info-card">
          <div className="info-card-head">
            <span className="info-tag">RITORNO</span>
            <span className="info-date">{flight.return.date}</span>
          </div>
          <div className="info-big">{flight.return.departure}</div>
          <div className="muted">Partenza {flight.return.airport}</div>
          <div className="info-sub">{flight.return.pickup}</div>
        </div>
      </div>

      <h2 className="section-title"><AlertTriangle size={16} /> Emergenze</h2>
      <div className="info-group">
        {emergency.map((e) => (
          <NumberRow key={e.label} {...e} />
        ))}
      </div>

      <h2 className="section-title"><Phone size={16} /> Taxi & transfer</h2>
      <div className="info-group">
        {taxis.map((t) => (
          <NumberRow key={t.label} {...t} />
        ))}
      </div>

      <h2 className="section-title"><Wallet size={16} /> Prezzi tipici (Agosto)</h2>
      <div className="price-grid">
        {prices.map((p) => (
          <div key={p.item} className="price-row">
            <span>{p.item}</span>
            <strong>{p.range}</strong>
          </div>
        ))}
      </div>

      <p className="info-foot muted">
        💡 In Portogallo e Spagna la moneta è l'<strong>EUR</strong>. Le carte contactless funzionano ovunque.
      </p>
    </section>
  );
}
