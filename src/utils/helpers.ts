export function classNames(...arr: (string | boolean | undefined | null)[]): string {
  return arr.filter(Boolean).join(" ");
}
