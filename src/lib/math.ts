export const gcd = (a: number, b: number): number => {
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}

export const lcm = (a: number, b: number): number => {
  return Math.abs(a * b) / gcd(a, b)
}
