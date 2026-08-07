import { useState } from "react";
import { Download, Upload, Trash2 } from "lucide-react";

const KEY_FAVS = "iberia.favs";
const KEY_LANG = "iberia.lang";
const KEY_CHECK = "iberia.checklist.v1";

function gather() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    favs: JSON.parse(localStorage.getItem(KEY_FAVS) || "[]"),
    lang: localStorage.getItem(KEY_LANG) || "it",
    checklist: JSON.parse(localStorage.getItem(KEY_CHECK) || "{}"),
  };
}

function apply(data) {
  if (!data || data.version !== 1) throw new Error("Formato non riconosciuto");
  if (data.favs) localStorage.setItem(KEY_FAVS, JSON.stringify(data.favs));
  if (data.lang) localStorage.setItem(KEY_LANG, data.lang);
  if (data.checklist) localStorage.setItem(KEY_CHECK, JSON.stringify(data.checklist));
}

export default function Backup() {
  const [status, setStatus] = useState("");

  const exportData = () => {
    const data = gather();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `iberia-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Esportato ✓");
    setTimeout(() => setStatus(""), 2000);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        apply(data);
        setStatus("Importato ✓ Ricarica la pagina");
        setTimeout(() => location.reload(), 800);
      } catch (err) {
        setStatus("File non valido");
        setTimeout(() => setStatus(""), 2000);
      }
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    if (!confirm("Eliminare TUTTI i dati locali (preferiti, lingua, checklist)?")) return;
    localStorage.removeItem(KEY_FAVS);
    localStorage.removeItem(KEY_LANG);
    localStorage.removeItem(KEY_CHECK);
    setStatus("Reset ✓");
    setTimeout(() => location.reload(), 500);
  };

  return (
    <section className="backup">
      <h2 className="section-title">💾 Backup</h2>
      <p className="muted" style={{ fontSize: 12, marginTop: -8 }}>
        Salva i tuoi preferiti e la checklist su un file, oppure ripristinali.
      </p>

      <div className="backup-grid">
        <button className="backup-card" onClick={exportData}>
          <Download size={20} />
          <strong>Esporta</strong>
          <span className="muted">Scarica JSON</span>
        </button>

        <label className="backup-card">
          <Upload size={20} />
          <strong>Importa</strong>
          <span className="muted">Da file JSON</span>
          <input
            type="file"
            accept="application/json,.json"
            onChange={importData}
            style={{ display: "none" }}
          />
        </label>

        <button className="backup-card danger" onClick={clearAll}>
          <Trash2 size={20} />
          <strong>Reset</strong>
          <span className="muted">Cancella tutto</span>
        </button>
      </div>

      {status && <div className="backup-status">{status}</div>}
    </section>
  );
}
