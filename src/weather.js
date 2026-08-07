// Open-Meteo wrapper — no API key required
// Docs: https://open-meteo.com/en/docs

const CACHE_KEY = "iberia.weather";
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

function cacheKey(lat, lng) {
  return `${lat.toFixed(2)},${lng.toFixed(2)}`;
}

function readCache(lat, lng) {
  try {
    const all = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    const entry = all[cacheKey(lat, lng)];
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache(lat, lng, data) {
  try {
    const all = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    all[cacheKey(lat, lng)] = { ts: Date.now(), data };
    localStorage.setItem(CACHE_KEY, JSON.stringify(all));
  } catch {
    // ignore quota errors
  }
}

const wmoCode = {
  0: { label: "Sereno", icon: "☀️" },
  1: { label: "Quasi sereno", icon: "🌤️" },
  2: { label: "Parz. nuvoloso", icon: "⛅" },
  3: { label: "Coperto", icon: "☁️" },
  45: { label: "Nebbia", icon: "🌫️" },
  48: { label: "Nebbia", icon: "🌫️" },
  51: { label: "Pioggerella", icon: "🌦️" },
  53: { label: "Pioggerella", icon: "🌦️" },
  55: { label: "Pioggerella", icon: "🌦️" },
  61: { label: "Pioggia", icon: "🌧️" },
  63: { label: "Pioggia", icon: "🌧️" },
  65: { label: "Pioggia forte", icon: "🌧️" },
  71: { label: "Neve", icon: "🌨️" },
  73: { label: "Neve", icon: "🌨️" },
  75: { label: "Neve", icon: "🌨️" },
  80: { label: "Rovesci", icon: "🌦️" },
  81: { label: "Rovesci", icon: "🌦️" },
  82: { label: "Rovesci forti", icon: "⛈️" },
  95: { label: "Temporale", icon: "⛈️" },
  96: { label: "Temporale", icon: "⛈️" },
  99: { label: "Temporale", icon: "⛈️" },
};

export function describeCode(code) {
  return wmoCode[code] || { label: "—", icon: "🌡️" };
}

export async function fetchWeather(lat, lng, startDate, endDate) {
  const cached = readCache(lat, lng);
  if (cached) return cached;

  const start = startDate || new Date().toISOString().slice(0, 10);
  const end = endDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto&start_date=${start}&end_date=${end}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`weather ${res.status}`);
    const data = await res.json();
    const out = {
      days: data.daily.time.map((t, i) => ({
        date: t,
        code: data.daily.weather_code[i],
        tmax: data.daily.temperature_2m_max[i],
        tmin: data.daily.temperature_2m_min[i],
        pop: data.daily.precipitation_probability_max?.[i] ?? 0,
        wind: data.daily.wind_speed_10m_max[i],
      })),
    };
    writeCache(lat, lng, out);
    return out;
  } catch (e) {
    return null;
  }
}
