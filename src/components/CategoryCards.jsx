import { useMemo } from 'react'
import { FolderOpen } from 'lucide-react'

function CategoryCard({ name, total, count }) {
  const formatted = new Intl.NumberFormat('ko-KR').format(total)
  const isPlus = total >= 0

  return (
    <div className="toss-card p-4 min-w-[140px] shrink-0">
      <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-2">
        <FolderOpen className="w-3.5 h-3.5" />
        {name}
      </div>
      <p className={`text-lg font-bold ${isPlus ? 'text-blue-600' : 'text-red-600'}`}>
        {isPlus ? '+' : ''}${formatted}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{count}건</p>
    </div>
  )
}

export function CategoryCards({ transactions }) {
  const byCategory = useMemo(() => {
    const map = {}
    for (const t of transactions) {
      const key = t.category || '미분류'
      if (!map[key]) map[key] = { total: 0, count: 0 }
      map[key].total += t.amount
      map[key].count += 1
    }
    return Object.entries(map).map(([name, data]) => ({ name, ...data }))
  }, [transactions])

  if (byCategory.length === 0) {
    return (
      <div className="toss-card p-6 mb-6 text-center text-gray-400 text-sm">
        내역을 입력하면 카테고리별 요약이 표시됩니다.
      </div>
    )
  }

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">카테고리별 요약</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1">
        {byCategory.map((cat) => (
          <CategoryCard key={cat.name} name={cat.name} total={cat.total} count={cat.count} />
        ))}
      </div>
    </div>
  )
}
