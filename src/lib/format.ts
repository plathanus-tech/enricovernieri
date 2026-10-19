export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" }) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", ...opts }).format(new Date(iso + "T00:00:00Z"));
