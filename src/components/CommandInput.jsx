import { useState, useMemo } from 'react'
import { Send, ChevronDown } from 'lucide-react'
import { useAddTransaction, NEW_CATEGORY_VALUE, getTodayStr } from '../hooks/useAddTransaction'

export function CommandInput({ transactions = [] }) {
  const [categorySelect, setCategorySelect] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [content, setContent] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => getTodayStr())
  const { addTransaction, submitting, error } = useAddTransaction()

  const categoryOptions = useMemo(() => {
    const set = new Set()
    transactions.forEach((t) => t.category && set.add(t.category))
    return Array.from(set).sort()
  }, [transactions])

  const isNewCategory = categorySelect === NEW_CATEGORY_VALUE
  const category = isNewCategory ? newCategory.trim() : categorySelect

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    const num = Number(amount)
    const { success } = await addTransaction({
      category,
      content: content.trim(),
      amount: num,
      date: date || getTodayStr(),
    })
    if (success) {
      setContent('')
      setAmount('')
      if (!isNewCategory) setCategorySelect('')
      setNewCategory('')
    }
  }

  const valid = category && content.trim() && amount.trim() && !Number.isNaN(Number(amount)) && Number(amount) !== 0

  return (
    <div className="input-bar">
      <form onSubmit={handleSubmit} className="w-full min-w-0 max-w-full">
        <div className="input-bar-inner">
          {/* 1행: 구분 / 금액 / 날짜 */}
          <div className="flex flex-wrap gap-2 items-end mb-2">
            <div className="min-w-[72px] flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-0.5">구분</label>
              <div className="relative">
                <select
                  value={categorySelect}
                  onChange={(e) => setCategorySelect(e.target.value)}
                  className="toss-input w-full px-2.5 py-2.5 text-sm appearance-none bg-white pr-7 box-border max-w-full"
                  disabled={submitting}
                >
                  <option value="">선택</option>
                  {categoryOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                  <option value={NEW_CATEGORY_VALUE}>➕ 새로</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {isNewCategory && (
              <div className="min-w-[64px] flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-0.5">새 구분</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="이름"
                  className="toss-input w-full px-2.5 py-2.5 text-sm box-border max-w-full"
                  disabled={submitting}
                  autoComplete="off"
                />
              </div>
            )}
            <div className="min-w-[72px] flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-0.5">금액</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                className="toss-input w-full px-2.5 py-2.5 text-sm box-border max-w-full"
                disabled={submitting}
                autoComplete="off"
              />
            </div>
            <div className="min-w-[72px] flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-0.5">날짜</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="toss-input w-full px-2.5 py-2.5 text-sm box-border max-w-full"
                disabled={submitting}
              />
            </div>
          </div>
          {/* 2행: 내용(가로로 길게) + 입력 */}
          <div className="flex gap-2 items-end min-w-0">
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-500 mb-0.5">내용</label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="예: 프린터, 용도 등"
                className="toss-input w-full px-3 py-2.5 text-sm box-border"
                disabled={submitting}
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !valid}
              className="shrink-0 min-h-[42px] px-4 rounded-xl font-semibold text-white bg-[#3182f6] hover:bg-[#1b64da] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5 touch-manipulation box-border"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap text-sm">{submitting ? '저장 중' : '입력'}</span>
            </button>
          </div>
        </div>
        {error && (
          <p className="px-3 pb-2 pt-0 text-sm text-red-600 border-t border-gray-100 bg-red-50/30">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}
