import { useState, useMemo } from 'react'
import { BalanceCard } from './components/BalanceCard'
import { CategoryCards } from './components/CategoryCards'
import { TransactionTable } from './components/TransactionTable'
import { CommandInput } from './components/CommandInput'
import { useTransactions } from './hooks/useTransactions'

function App() {
  const [categoryExpanded, setCategoryExpanded] = useState(false)
  const { transactions, loading, error } = useTransactions()
  const totalBalance = useMemo(
    () => transactions.reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  )

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#f5f6f8] overflow-x-hidden min-w-0 max-w-full">
      <main
        className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] min-w-0 overflow-x-hidden"
      >
        <h1 className="text-xl font-bold text-gray-900 mb-6">투자금 관리</h1>

        <BalanceCard
          total={totalBalance}
          categoryExpanded={categoryExpanded}
          onToggleCategory={() => setCategoryExpanded((e) => !e)}
        />
        {categoryExpanded && <CategoryCards transactions={transactions} />}
        <TransactionTable transactions={transactions} loading={loading} />

        {error && (
          <p className="text-red-600 text-sm mt-4">데이터 불러오기 실패: {error.message}</p>
        )}
      </main>
      <CommandInput transactions={transactions} />
    </div>
  )
}

export default App
