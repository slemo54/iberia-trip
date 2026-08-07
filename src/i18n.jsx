import { createContext, useContext, useEffect, useState } from "react";

const LangCtx = createContext(null);

const dict = {
  it: {
    today: "Oggi",
    tomorrow: "Domani",
    day: "Giorno",
    summary: "Riepilogo",
    contacts: "Contatti",
    keys: "Chiavi",
    parking: "Parcheggio",
    pool: "Piscina",
    host: "Host",
    address: "Indirizzo",
    openMaps: "Apri in Maps",
    callHost: "Chiama host",
    favorites: "Preferiti",
    addFav: "Aggiungi ai preferiti",
    removeFav: "Togli dai preferiti",
    quickLinks: "Link rapidi",
    surf: "Surf",
    food: "Cibo",
    night: "Notte",
    sights: "Cose da vedere",
    transit: "Trasferimento",
    beach: "Spiaggia",
    back: "Indietro",
    next: "Avanti",
    language: "Lingua",
  },
  en: {
    today: "Today",
    tomorrow: "Tomorrow",
    day: "Day",
    summary: "Summary",
    contacts: "Contacts",
    keys: "Keys",
    parking: "Parking",
    pool: "Pool",
    host: "Host",
    address: "Address",
    openMaps: "Open in Maps",
    callHost: "Call host",
    favorites: "Favorites",
    addFav: "Add to favorites",
    removeFav: "Remove from favorites",
    quickLinks: "Quick links",
    surf: "Surf",
    food: "Food",
    night: "Nightlife",
    sights: "Sights",
    transit: "Transit",
    beach: "Beach",
    back: "Back",
    next: "Next",
    language: "Language",
  },
  pt: {
    today: "Hoje",
    tomorrow: "Amanhã",
    day: "Dia",
    summary: "Resumo",
    contacts: "Contactos",
    keys: "Chaves",
    parking: "Estacionamento",
    pool: "Piscina",
    host: "Anfitrião",
    address: "Morada",
    openMaps: "Abrir no Maps",
    callHost: "Ligar ao anfitrião",
    favorites: "Favoritos",
    addFav: "Adicionar aos favoritos",
    removeFav: "Remover dos favoritos",
    quickLinks: "Links rápidos",
    surf: "Surf",
    food: "Comida",
    night: "Noite",
    sights: "Pontos turísticos",
    transit: "Transporte",
    beach: "Praia",
    back: "Voltar",
    next: "Seguinte",
    language: "Idioma",
  },
};

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("iberia.lang") || "it");

  useEffect(() => {
    localStorage.setItem("iberia.lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (k) => dict[lang][k] ?? dict.it[k] ?? k;
  return (
    <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>
  );
}

export const useLang = () => useContext(LangCtx);
