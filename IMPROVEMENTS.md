# Iberia Trip — Improvement Log

Web app: https://iberia-trip-puce.vercel.app
Repo: https://github.com/slemo54/iberia-trip

## v1.0 (deploy 1) — base
- Vite 8 + React 19, framer-motion, lucide-react
- Dark/glass UI: gradient viola→blu, glassmorphism, sfondo grid
- 4 tab: Timeline · Alloggi · Link rapidi · Preferiti
- 8 giorni, 3 alloggi con indirizzo Maps + tap-to-call host
- Quick links: surf (Amado, Carcavelos, Caparica), nightlife, food
- Lingue: IT / EN / PT
- "Oggi" auto-evidenziato
- Preferiti in localStorage
- PWA-ready: theme color, viewport-fit, status bar
- Bundle: 336 kB JS / 108 kB gzip

## v1.1 (deploy 2) — info vive
1. **Trip header dinamico** con countdown prima del viaggio, "Giorno N di 8" durante, progress bar animata, stato "concluso" dopo.
2. **Meteo live per ogni giorno** via Open-Meteo (no API key), cache localStorage 6h, mostra icona + tmax/tmin + probabilità pioggia se >20%.
3. **Sun times** (alba/tramonto) calcolate on-device con algoritmo NOAA per le coordinate di ogni tappa, così sai quando andare a Ponta da Piedade per il tramonto.

## v1.2 (deploy 3) — strumenti
1. **Surf forecast** con tab per 4 spot (Amado, Carcavelos, Caparica, Guincho) e embed Windy per vento/onde live, no API key.
2. **Checklist pre-partenza** con 3 sezioni editabili (Da preparare, valigia, offline), progress bar, salva stato in localStorage.
3. **Bottone Share nativo** su ogni giorno (`navigator.share` con fallback clipboard) + safe-area top per iPhone con notch.
4. Bonus: 6 tab in basso (Timeline, Stays, Surf, Links, Check, Favs).

## v1.3 (deploy 4) — mappa + backup
1. **Mappa Leaflet dark** (CartoDB dark tiles) con tutti i pin: 3 alloggi + 4 spot surf + aeroporto Siviglia, polyline tratteggiata della rotta, lazy-loaded (chunk separato 157kB).
2. **ETA drive** tra tappe calcolate on-device con formula haversine + 30% correzione strade + 90 km/h media. Es: Lisbona→Siviglia 4h30m, 405 km.
3. **Backup/Export JSON** (favoriti + checklist + lang) con import e reset, accessibile dal bottom sheet "Strumenti" (icona in top-bar).
