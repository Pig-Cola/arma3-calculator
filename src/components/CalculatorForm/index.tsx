import type { CalculationInput, FiringMode } from '@/types'
import { FiringModeEnum } from '@/types'
import RulerIcon from '@/components/icons/RulerIcon'
import TargetIcon from '@/components/icons/TargetIcon'
import ElevationIcon from '@/components/icons/ElevationIcon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCalculatorStore } from '@/store/useCalculatorStore'
import styles from './index.module.scss'
import { useState } from 'react'

const InputField: React.FC<{
  label: string
  value: number
  onChange: ( e: React.ChangeEvent<HTMLInputElement> ) => void
  name: keyof CalculationInput
  unit: string
  icon: React.ReactNode
}> = ( { label, value, onChange, name, unit, icon } ) => {
  const [_forceUpdate, setForceUpdate] = useState( 0 )
  const forceUpdate = () => setForceUpdate( ( prev ) => prev + 1 )

  return (
    <div className={styles.fieldGroup}>
      <Label htmlFor={name} className="text-gray-400">
        {label}
      </Label>
      <div className={styles.inputWrapper}>
        <div className={styles.icon}>{icon}</div>
        <Input
          key={_forceUpdate}
          type="number"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={forceUpdate}
          className="pl-11 pr-12 h-11 bg-gray-900/70 border-gray-700 text-gray-200 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
          placeholder="0"
          aria-label={label}
        />
        <span className={styles.unit}>{unit}</span>
      </div>
    </div>
  )
}

const CalculatorForm: React.FC = () => {
  const {
    inputs: { distance, targetElevation, selfElevation },
    firingMode,
    updateInput,
    setFiringMode,
    calculate,
  } = useCalculatorStore()

  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    const { name, value } = e.target
    updateInput( name as keyof CalculationInput, value === '' ? 0 : parseInt( value ) )
  }

  const handleSubmit = ( e: React.FormEvent ) => {
    e.preventDefault()
    calculate()
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.fieldGroup}>
        <Label className="text-gray-400">발사 모드</Label>
        <Tabs value={firingMode} onValueChange={( value ) => setFiringMode( value as FiringMode )} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-gray-700">
            <TabsTrigger
              value={FiringModeEnum.LOW_ANGLE}
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              {FiringModeEnum.LOW_ANGLE}
            </TabsTrigger>
            <TabsTrigger
              value={FiringModeEnum.HIGH_ANGLE}
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              {FiringModeEnum.HIGH_ANGLE}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className={styles.inputsContainer}>
        <InputField
          label="거리"
          name="distance"
          value={distance}
          onChange={handleInputChange}
          unit="m"
          icon={<RulerIcon />}
        />
        <InputField
          label="목표 고도"
          name="targetElevation"
          value={targetElevation}
          onChange={handleInputChange}
          unit="m"
          icon={<TargetIcon />}
        />
        <InputField
          label="자신 고도"
          name="selfElevation"
          value={selfElevation}
          onChange={handleInputChange}
          unit="m"
          icon={<ElevationIcon />}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-transform transform hover:scale-105"
      >
        계산
      </Button>
    </form>
  )
}

export default CalculatorForm
