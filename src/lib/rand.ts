export function choose<T>(arr: T[]): T {
  const index = between(0, arr.length);
  return arr[index];
}

export function between(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min));
}
