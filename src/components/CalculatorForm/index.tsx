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
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const InputField: React.FC<{
  label: string
  value: number
  onChange: ( e: React.ChangeEvent<HTMLInputElement> ) => void
  name: keyof CalculationInput
  unit: string
  icon: React.ReactNode
}> = ( { label, value, onChange, name, unit, icon } ) => {
  return (
    <div className={styles.fieldGroup}>
      <Label htmlFor={name} className="text-gray-400">
        {label}
      </Label>
      <div className={styles.inputWrapper}>
        <div className={styles.icon}>{icon}</div>
        <Input
          inputMode="numeric"
          id={name}
          name={name}
          value={/* `${value}` */ value}
          onChange={onChange}
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
    // isLinearInterpolationMode,

    updateInput,
    setFiringMode,
    calculate,
    // toggleIsLinearInterpolationMode,
  } = useCalculatorStore()

  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    const { name, value } = e.target
    updateInput( name as keyof CalculationInput, value === '' ? 0 : parseInt( value ) || 0 )
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

      <div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', gap: 'var(--app-spacing-md)' }}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexFlow: 'row nowrap',
            alignItems: 'center',
            gap: 'var(--app-spacing-sm)',
            justifyContent: 'flex-start',
          }}
        >
          <Label htmlFor="test" className="text-gray-400">
            <del>선형 보간 계산법 적용</del> (현재 상시 적용 중)
          </Label>
          <Popover>
            <PopoverTrigger style={{alignSelf: 'flex-start'}}>
              <p>ⓘ</p>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              style={{ backgroundColor: 'var(--app-bg-secondary)', borderColor: 'var(--app-border-color)' }}
            >
              비활성화 시 특별한 가중치를 통한 계산이 적용됨.
            </PopoverContent>
          </Popover>
        </div>
        <Switch
          id="test"
          checked={true}
          disabled={true}
          // checked={isLinearInterpolationMode}
          // onCheckedChange={() => toggleIsLinearInterpolationMode()}
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
