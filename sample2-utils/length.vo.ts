// Types
export type Centimeter = number
export type Milimeter = number
export type Inch = number

// Convertors
export function inchToCm(inch: Inch): Centimeter {
  return inch * 2.54
}

export function cmToMm(inch: Centimeter): Milimeter {
  return inch * 10
}
