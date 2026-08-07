import { useEffect, useState } from "react";
import { ListChecks, Plus, Trash2 } from "lucide-react";

const DEFAULTS = {
  "Da preparare": [
    "Carta d'identità valida per l'espatrio",
    "Patente (per noleggio auto)",
    "Carta di credito per cauzione auto",
    "Biglietti aereo (Siviglia → Verona)",
    "Conferma alloggi stampata/salvata",
  ],
  "Da mettere in valigia": [
    "Costume (×2)",
    "Crema solare SPF 50",
    "Sunglasses",
    "Scarpe da scoglio / ciabatte",
    "Asciugamano mare",
    "Powerbank",
    "Caricabatterie tipo C + multipresa",
    "Spazzolino + dentifricio",
    "Medicine personali",
  ],
  "Da scaricare offline": [
    "Maps area Algarve",
    "Maps area Lisbona",
    "Maps area Siviglia",
    "Playlist / podcast viaggio",
    "App compagnie aeree",
  ],
};

const KEY = "iberia.checklist.v1";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Deep clone defaults
  return JSON.parse(JSON.stringify(DEFAULTS));
}

export default function Checklist() {
  const [groups, setGroups] = useState(load);
  const [newItem, setNewItem] = useState({});

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(groups));
  }, [groups]);

  const toggle = (g, i) => {
    setGroups((prev) => {
      const next = { ...prev, [g]: prev[g].map((it, idx) =>
        idx === i ? { ...it, done: !it.done } : it
      )};
      return next;
    });
  };

  const remove = (g, i) => {
    setGroups((prev) => ({ ...prev, [g]: prev[g].filter((_, idx) => idx !== i) }));
  };

  const add = (g) => {
    const txt = (newItem[g] || "").trim();
    if (!txt) return;
    setGroups((prev) => ({ ...prev, [g]: [...prev[g], { text: txt, done: false }] }));
    setNewItem((p) => ({ ...p, [g]: "" }));
  };

  const total = Object.values(groups).reduce((acc, arr) => acc + arr.length, 0);
  const done = Object.values(groups).reduce(
    (acc, arr) => acc + arr.filter((it) => it.done).length, 0
  );
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <section className="checklist">
      <h2 className="section-title"><ListChecks size={16} /> Checklist</h2>

      <div className="ck-progress">
        <div className="ck-progress-bar">
          <div className="ck-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="ck-progress-label">{done}/{total} · {pct}%</span>
      </div>

      {Object.entries(groups).map(([g, items]) => (
        <div key={g} className="ck-group">
          <h3>{g}</h3>
          <ul>
            {items.map((it, i) => (
              <li key={i} className={it.done ? "done" : ""}>
                <button
                  className="ck-check"
                  onClick={() => toggle(g, i)}
                  aria-checked={it.done}
                  role="checkbox"
                >
                  {it.done ? "✓" : ""}
                </button>
                <span className="ck-text">{it.text}</span>
                <button className="ck-del" onClick={() => remove(g, i)} aria-label="Elimina">
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
          <div className="ck-add">
            <input
              type="text"
              placeholder="Aggiungi…"
              value={newItem[g] || ""}
              onChange={(e) => setNewItem((p) => ({ ...p, [g]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && add(g)}
            />
            <button onClick={() => add(g)} aria-label="Aggiungi">
              <Plus size={14} />
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
