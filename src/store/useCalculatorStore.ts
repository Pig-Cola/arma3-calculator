import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calculateFireSolution } from '../services/artilleryCalculator'
import type { FiringMode, CalculationInput, CalculationResult } from '../types'

interface CalculatorStore {
  // 상태
  firingMode: FiringMode
  inputs: CalculationInput
  isLinearInterpolationMode: boolean
  result: CalculationResult | null

  // 액션
  setFiringMode: ( mode: FiringMode ) => void
  updateInput: ( key: keyof CalculationInput, value: number ) => void
  calculate: () => void
  toggleIsLinearInterpolationMode: () => void
}

export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    ( set, get ) => ( {
      // 초기 상태
      firingMode: '저사계',
      inputs: {
        distance: 1000,
        targetElevation: 100,
        selfElevation: 50,
      },
      result: null,
      isLinearInterpolationMode: false,

      // 액션들
      setFiringMode: ( mode ) => set( { firingMode: mode } ),

      updateInput: ( key, value ) =>
        set( ( state ) => ( {
          inputs: {
            ...state.inputs,
            [key]: value,
          },
        } ) ),

      calculate: () => {
        const { inputs, firingMode } = get()
        const calculationResult = calculateFireSolution( inputs, firingMode )
        set( { result: calculationResult } )
      },

      toggleIsLinearInterpolationMode: () =>
        set( ( state ) => ( {
          isLinearInterpolationMode: !state.isLinearInterpolationMode,
        } ) ),
    } ),
    {
      name: 'arma3-calculator-storage',
      partialize: ( state ) => ( {
        firingMode: state.firingMode,
        inputs: state.inputs,
        isLinearInterpolationMode: state.isLinearInterpolationMode,
        // result는 저장하지 않음 (계산 결과는 휘발성)
      } ),
    },
  ),
)
