import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`; // Ako je veličina manja od 1 KB, prikazuje u B
  } else if (bytes < 1024 * 1024) {
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`; // Prikazuje u KB sa 2 decimale
  } else if (bytes < 1024 * 1024 * 1024) {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`; // Prikazuje u MB sa 2 decimale
  } else {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`; // Prikazuje u GB sa 2 decimale
  }
}

export function formatDate(timestamp) {
  const now = new Date();
  const date = new Date(timestamp * 1000); // UNIX timestamp je u sekundama, pa množi sa 1000 za milisekunde

  // Proveri ako je datum danas
  if (now.toDateString() === date.toDateString()) {
    return "Today";
  }

  // Proveri ako je datum juče
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) {
    return "Yesterday";
  }

  // Proveri ako je datum u ovoj sedmici
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Prvi dan sedmice
  if (date >= startOfWeek) {
    return "This week";
  }

  // Ako nije ni jedan od prethodnih, formatiraj kao mesec dan, godina
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options); // Ispisuje kao "Sep 18, 2024"
}