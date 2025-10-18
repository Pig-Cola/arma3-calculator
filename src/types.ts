export const FiringModeEnum = {
  LOW_ANGLE: '저사계',
  HIGH_ANGLE: '고사계',
} as const

export type FiringMode = typeof FiringModeEnum.LOW_ANGLE | typeof FiringModeEnum.HIGH_ANGLE

export interface CalculationInput {
  distance: number
  targetElevation: number
  selfElevation: number
}

export interface CalculationResult {
  elevation: number | null
  charge: number | null
  eta: number | null
  error?: string
}

export interface FireDataPoint {
  distance: number
  elevation: number
  eta: number
}

export interface ChargeData {
  charge: number
  data: FireDataPoint[]
}
