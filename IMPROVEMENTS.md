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
