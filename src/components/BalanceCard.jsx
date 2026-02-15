import { Wallet, ChevronDown, ChevronUp } from 'lucide-react'

export function BalanceCard({ total, categoryExpanded, onToggleCategory }) {
  const formatted = new Intl.NumberFormat('ko-KR').format(total)
  const isNegative = total < 0

  return (
    <div className="toss-card p-5 sm:p-8 mb-6 overflow-hidden min-w-0">
      <div className="flex items-center justify-between gap-3 sm:gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
            <Wallet className="w-4 h-4 shrink-0" />
            총 투자 잔액
          </div>
          <p className={`text-2xl sm:text-3xl font-bold tracking-tight truncate ${isNegative ? 'text-red-600' : 'text-gray-900'}`}>
            {isNegative ? '-' : ''}${formatted}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleCategory}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-100 active:bg-gray-100 transition-colors touch-manipulation"
        >
          {categoryExpanded ? (
            <>
              접기
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span className="hidden sm:inline">카테고리별 요약 </span>펼치기
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
