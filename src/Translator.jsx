import { useState } from "react";
import { Volume2, Languages } from "lucide-react";
import { useLang } from "./i18n";

const phrases = {
  pt: [
    { it: "Buongiorno", pt: "Bom dia" },
    { it: "Grazie", pt: "Obrigado (m) / Obrigada (f)" },
    { it: "Per favore", pt: "Por favor" },
    { it: "Il conto, per favore", pt: "A conta, por favor" },
    { it: "Dov'è la spiaggia?", pt: "Onde é a praia?" },
    { it: "Quanto costa?", pt: "Quanto custa?" },
    { it: "Un caffè, per favore", pt: "Um café, por favor" },
    { it: "Una birra, per favore", pt: "Uma cerveja, por favor" },
    { it: "Non parlo portoghese", pt: "Não falo português" },
    { it: "Parla inglese?", pt: "Fala inglês?" },
    { it: "Dov'è il bagno?", pt: "Onde é a casa de banho?" },
    { it: "Acqua, per favore", pt: "Água, por favor" },
    { it: "Mi può aiutare?", pt: "Pode ajudar-me?" },
    { it: "Dov'è la stazione?", pt: "Onde é a estação?" },
    { it: "A che ora chiude?", pt: "A que horas fecha?" },
  ],
  es: [
    { it: "Buongiorno", es: "Buenos días" },
    { it: "Grazie", es: "Gracias" },
    { it: "Per favore", es: "Por favor" },
    { it: "Il conto, per favore", es: "La cuenta, por favor" },
    { it: "Dov'è la spiaggia?", es: "¿Dónde está la playa?" },
    { it: "Quanto costa?", es: "¿Cuánto cuesta?" },
    { it: "Un caffè, per favore", es: "Un café, por favor" },
    { it: "Una birra (caña), per favore", es: "Una caña, por favor" },
    { it: "Non parlo spagnolo", es: "No hablo español" },
    { it: "Parla inglese?", es: "¿Habla inglés?" },
    { it: "Dov'è il bagno?", es: "¿Dónde está el baño?" },
    { it: "Acqua, per favore", es: "Agua, por favor" },
    { it: "Mi può aiutare?", es: "¿Puede ayudarme?" },
    { it: "Dov'è la stazione?", es: "¿Dónde está la estación?" },
    { it: "A che ora chiude?", es: "¿A qué hora cierra?" },
  ],
};

function speak(text, lang) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export default function Translator() {
  const { lang: uiLang } = useLang();
  const [target, setTarget] = useState("pt");
  const list = phrases[target] || [];

  return (
    <section className="translator">
      <h2 className="section-title"><Languages size={16} /> Frasi utili</h2>

      <div className="tr-switch">
        <button className={target === "pt" ? "on" : ""} onClick={() => setTarget("pt")}>
          🇵🇹 Portoghese
        </button>
        <button className={target === "es" ? "on" : ""} onClick={() => setTarget("es")}>
          🇪🇸 Spagnolo
        </button>
      </div>

      <ul className="tr-list">
        {list.map((p, i) => (
          <li key={i}>
            <div className="tr-it">{p.it}</div>
            <div className="tr-target">
              <span>{p[target]}</span>
              <button
                className="tr-speak"
                onClick={() => speak(p[target], target === "pt" ? "pt-PT" : "es-ES")}
                aria-label="Pronuncia"
                title="Ascolta pronuncia"
              >
                <Volume2 size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
