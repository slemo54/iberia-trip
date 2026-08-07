// iCal (.ics) export per l'itinerario
// Compatibile con Google Calendar, Apple Calendar, Outlook

function fmtDate(d) {
  // YYYYMMDD
  return d.replace(/-/g, "");
}

function fmtTime(d, h = 9, m = 0) {
  // HHMMSS in floating local time
  return `${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
}

function escapeIcs(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcs(days) {
  const now = "20260101T000000Z";
  const events = [];

  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    const dtStart = `${fmtDate(d.date)}T${fmtTime(d.date, 9, 0)}`;
    const dtEnd = `${fmtDate(d.date)}T${fmtTime(d.date, 23, 0)}`;

    const summary = escapeIcs(`${d.weekday} ${d.date.slice(8)} Ago · ${d.title}`);
    const description = escapeIcs(d.summary + "\n\n" + d.blocks.map((b) => "• " + b.text).join("\n"));
    const uid = `${d.id}-iberia-trip@anselmo.local`;

    events.push(
      `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART;TZID=Europe/Madrid:${dtStart}
DTEND;TZID=Europe/Madrid:${dtEnd}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:Iberia
END:VEVENT`
    );
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Iberia Trip//IT//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Iberia Trip 8-15 Agosto
X-WR-TIMEZONE:Europe/Madrid
BEGIN:VTIMEZONE
TZID:Europe/Madrid
BEGIN:STANDARD
DTSTART:20261025T030000
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:20260329T020000
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
END:DAYLIGHT
END:VTIMEZONE
${events.join("\n")}
END:VCALENDAR`;
}

export function downloadIcs(days) {
  const ics = buildIcs(days);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "iberia-trip.ics";
  a.click();
  URL.revokeObjectURL(url);
}
