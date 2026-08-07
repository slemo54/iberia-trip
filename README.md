# Iberia Trip 🌍

Web app mobile-first per il viaggio **Algarve · Lisbona · Siviglia** (8–15 Agosto 2026).

## Stack
- **Vite 8** + **React 19**
- **framer-motion** per le micro-animazioni
- **lucide-react** per le icone
- CSS puro con design system dark/glass (gradient viola→blu)

## Funzioni
- 🗓️ Timeline giorno per giorno
- 🛏️ Card alloggi con indirizzo Maps, chiavi, parcheggio, piscina, contatto host (tap-to-call)
- ⚡ Link rapidi raggruppati (surf, nightlife, food) — tap apre Maps
- ❤️ Preferiti in `localStorage`
- 🌐 Multilingua IT / EN / PT
- 📱 PWA-ready (theme color, viewport-fit, status bar)
- 🎯 "Oggi" evidenziato automaticamente

## Sviluppo
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produzione
```

## Deploy
Push su `main` → Vercel deploy automatico.
