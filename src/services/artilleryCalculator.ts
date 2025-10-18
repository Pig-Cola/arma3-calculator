import type { CalculationInput, CalculationResult, FiringMode, ChargeData, FireDataPoint } from '../types'
import { FiringModeEnum } from '../types'
import { LOW_ANGLE_DATA, HIGH_ANGLE_DATA, NATO_MILS_IN_QUADRANT } from '@/constants'

const linearInterpolate = ( x: number, x1: number, y1: number, x2: number, y2: number ): number => {
  if ( x1 === x2 ) return y1
  return y1 + ( ( x - x1 ) * ( y2 - y1 ) ) / ( x2 - x1 )
}

export const calculateFireSolution = ( inputs: CalculationInput, firingMode: FiringMode ): CalculationResult => {
  const { distance, targetElevation, selfElevation } = inputs

  if ( isNaN( distance ) || isNaN( targetElevation ) || isNaN( selfElevation ) ) {
    return { error: '모든 입력 값은 숫자여야 합니다.', elevation: null, charge: null, eta: null }
  }

  if ( distance <= 0 ) {
    return { error: '거리는 0보다 커야 합니다.', elevation: null, charge: null, eta: null }
  }

  const artilleryData = firingMode === FiringModeEnum.LOW_ANGLE ? LOW_ANGLE_DATA : HIGH_ANGLE_DATA

  let selectedChargeData: ChargeData | null = null
  // Select the lowest possible charge for the given distance
  for ( const charge of artilleryData ) {
    if ( distance <= charge.data[charge.data.length - 1].distance ) {
      selectedChargeData = charge
      break
    }
  }

  if ( !selectedChargeData ) {
    return { error: '사거리 초과', elevation: null, charge: null, eta: null }
  }

  const fireData = selectedChargeData.data

  if ( distance < fireData[0].distance ) {
    return {
      error: `거리가 너무 가깝습니다 (선택된 장약 ${selectedChargeData.charge}의 최소 사거리는 ${fireData[0].distance}m 입니다).`,
      elevation: null,
      charge: null,
      eta: null,
    }
  }

  let lowerBound: FireDataPoint | null = null
  let upperBound: FireDataPoint | null = null

  for ( let i = 0; i < fireData.length - 1; i++ ) {
    if ( distance >= fireData[i].distance && distance <= fireData[i + 1].distance ) {
      lowerBound = fireData[i]
      upperBound = fireData[i + 1]
      break
    }
  }

  if ( !lowerBound || !upperBound ) {
    // This case might happen if the distance is exactly the max range of a charge
    // and that point is the last in the array.
    if ( distance === fireData[fireData.length - 1].distance ) {
      lowerBound = fireData[fireData.length - 1]
      upperBound = fireData[fireData.length - 1]
    } else {
      return { error: '데이터 테이블 범위 오류', elevation: null, charge: null, eta: null }
    }
  }

  const tableElevation = linearInterpolate(
    distance,
    lowerBound.distance,
    lowerBound.elevation,
    upperBound.distance,
    upperBound.elevation,
  )

  const tableEta = linearInterpolate( distance, lowerBound.distance, lowerBound.eta, upperBound.distance, upperBound.eta )

  const deltaElevation = targetElevation - selfElevation
  // atan returns radians, we convert it to mils
  // 1 rad = 3200/PI mils
  const elevationCorrectionRad = Math.atan( deltaElevation / distance )
  const elevationCorrectionMils = ( elevationCorrectionRad * ( NATO_MILS_IN_QUADRANT * 2 ) ) / Math.PI

  const finalElevation = tableElevation + elevationCorrectionMils

  return {
    charge: selectedChargeData.charge,
    elevation: parseFloat( finalElevation.toFixed( 1 ) ),
    eta: parseFloat( tableEta.toFixed( 1 ) ),
  }
}
