export function normalizeLine(line: string): string {
  return line
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}
