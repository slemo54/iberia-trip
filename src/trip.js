import { trip } from "./data/itinerary";

export function tripProgress(now = new Date()) {
  const start = new Date(trip.meta.start + "T00:00:00");
  const end = new Date(trip.meta.end + "T23:59:59");
  const ms = now - start;
  const total = end - start;
  const days = ms / (1000 * 60 * 60 * 24);
  const currentDayIdx = Math.floor(days);
  const dayOfTotal = total / (1000 * 60 * 60 * 24);

  if (now < start) {
    return {
      phase: "before",
      daysUntil: Math.ceil((start - now) / (1000 * 60 * 60 * 24)),
      currentDayIdx: null,
      progress: 0,
      dayOfTotal,
    };
  }
  if (now > end) {
    return {
      phase: "after",
      daysSince: Math.floor((now - end) / (1000 * 60 * 60 * 24)),
      currentDayIdx: null,
      progress: 1,
      dayOfTotal,
    };
  }
  return {
    phase: "during",
    daysUntil: 0,
    currentDayIdx: Math.max(0, Math.min(trip.days.length - 1, currentDayIdx)),
    progress: ms / total,
    dayOfTotal,
  };
}
