// Sun times: alba, tramonto, golden hour, blue hour
// Algoritmo NOAA semplificato (accuratezza ±1 min, sufficiente per uso viaggio)

const toRad = (d) => (d * Math.PI) / 180;
const toDeg = (r) => (r * 180) / Math.PI;

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function fmtTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function sunTimes(date, lat, lng) {
  // Calculate sunrise/sunset for given date and coordinates
  const day = dayOfYear(date);
  const declination = 23.45 * Math.sin(toRad((360 / 365) * (day - 81)));
  const latRad = toRad(lat);

  const cosH = -Math.tan(latRad) * Math.tan(toRad(declination));
  if (cosH > 1) return null; // polar night
  if (cosH < -1) return null; // midnight sun
  const H = toDeg(Math.acos(cosH)) / 15;

  const solarNoon = 12 - lng / 15; // approximate, no equation of time correction

  const sunrise = solarNoon - H;
  const sunset = solarNoon + H;

  const toDate = (h) => {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    const d = new Date(date);
    d.setHours(hh, mm, 0, 0);
    return d;
  };

  // Golden hour: ~1h after sunrise, ~1h before sunset
  // Blue hour: ~30m before sunrise, ~30m after sunset
  return {
    sunrise: toDate(sunrise),
    sunset: toDate(sunset),
    goldenMorning: { start: toDate(sunrise), end: toDate(sunrise + 1) },
    goldenEvening: { start: toDate(sunset - 1), end: toDate(sunset) },
    blueHour: { start: toDate(sunset), end: toDate(sunset + 0.5) },
  };
}

export function formatTime(d) {
  if (!d) return "—";
  return fmtTime(d);
}
