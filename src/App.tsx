import CalculatorForm from '@/components/CalculatorForm'
import ResultDisplay from '@/components/ResultDisplay'
import styles from '@/App.module.scss'

import packageJson from '@/../package.json'

const App: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>ARMA 3</h1>
          <h1 className={styles.title}>SHOLEF 포병 계산기</h1>
          <p className={styles.subtitle}>version {packageJson.version}</p>
        </header>

        <main className={styles.main}>
          <CalculatorForm />
          <div className={styles.divider}></div>
          <ResultDisplay />
        </main>

        <footer className={styles.footer}>
          <p className={styles.footerText}>
            계산은 Arma 3 표준 탄도학을 기반으로 합니다. 게임 내에서 항상 확인 사격이 필요합니다.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
