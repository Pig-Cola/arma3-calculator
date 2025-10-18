import { Card, CardContent } from '@/components/ui/card'
import { useCalculatorStore } from '@/store/useCalculatorStore'
import styles from './index.module.scss'

const ResultItem: React.FC<{ label: string; value: string | number; unit?: string; isPrimary?: boolean }> = ( {
  label,
  value,
  unit,
  isPrimary = false,
} ) => (
  <Card className={isPrimary ? 'bg-gray-900 border border-green-500/50' : 'bg-gray-800/60'}>
    <CardContent className="p-4">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`font-bold ${isPrimary ? 'text-4xl text-green-400' : 'text-2xl text-gray-100'}`}>
        {value}
        {unit && <span className={`text-lg ml-1 ${isPrimary ? 'text-green-400/80' : 'text-gray-400'}`}>{unit}</span>}
      </p>
    </CardContent>
  </Card>
)

const ResultDisplay: React.FC = () => {
  const { result } = useCalculatorStore()

  if ( !result ) {
    return (
      <Card className="text-center bg-gray-900/50">
        <CardContent className="p-8">
          <p className="text-gray-500">결과가 여기에 표시됩니다.</p>
        </CardContent>
      </Card>
    )
  }

  if ( result.error ) {
    return (
      <Card className="text-center bg-red-900/50 border border-red-700">
        <CardContent className="p-8">
          <p className="font-semibold text-red-400">오류</p>
          <p className="text-red-400 mt-1">{result.error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={styles.container}>
      <ResultItem label="최종 사격각 (ELEV)" value={result.elevation ?? 'N/A'} unit="mils" isPrimary />
      <div className={styles.grid}>
        <ResultItem label="장약 (Charge)" value={result.charge ?? 'N/A'} />
        <ResultItem label="탄착 소요시간 (ETA)" value={result.eta ?? 'N/A'} unit="s" />
      </div>
    </div>
  )
}

export default ResultDisplay
