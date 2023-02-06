// Types
export type Kilogram = number
export type Gram = number
export type Pound = number

// Convertors
export function poundToKg(pound: Pound): Kilogram {
  return pound * 0.4535923
}

export function kgToGrams(weight: Kilogram): Gram {
  return Math.round(weight * 1000)
}

export function gramsToKg(weight: Gram): Kilogram {
  return Math.round(weight) / 1_000
}
