export function ucfirst(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function roundToTwo(input: number): number {
  return Math.round(input * 100) / 100;
}
