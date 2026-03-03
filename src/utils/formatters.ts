export function money(n: number): string {
  try {
    return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);
  } catch {
    return "S/ " + n;
  }
}
