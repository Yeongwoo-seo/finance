import { useState, useMemo } from 'react'
import { Pencil, Trash2, ChevronDown } from 'lucide-react'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'

/** DD/MM 형식 (예: 15/02), 연도 없음 */
function formatDateDDMM(dateStrOrTimestamp) {
  if (!dateStrOrTimestamp) return '-'
  try {
    const d = typeof dateStrOrTimestamp === 'string' && dateStrOrTimestamp.length >= 10
      ? new Date(dateStrOrTimestamp + 'T12:00:00')
      : new Date(dateStrOrTimestamp)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${day}/${month}`
  } catch {
    return '-'
  }
}

/** 트랜잭션의 날짜 값 (date 필드 또는 createdAt에서 추출) */
function getTransactionDateStr(t) {
  if (t.date && typeof t.date === 'string') return t.date
  if (t.createdAt) {
    try {
      return new Date(t.createdAt).toISOString().slice(0, 10)
    } catch {
      return null
    }
  }
  return null
}

const ALL_CATEGORIES = '__all__'

export function TransactionTable({ transactions, loading }) {
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORIES)
  const [selectedId, setSelectedId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ category: '', content: '', amount: '', date: '' })

  const categoryOptions = useMemo(() => {
    const set = new Set()
    transactions.forEach((t) => t.category && set.add(t.category))
    return Array.from(set).sort()
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    if (!categoryFilter || categoryFilter === ALL_CATEGORIES) return transactions
    return transactions.filter((t) => (t.category || '') === categoryFilter)
  }, [transactions, categoryFilter])

  const setCategoryFilterOnly = (cat) => {
    setCategoryFilter(cat)
    setSelectedId(null)
  }

  const openEditForSelected = () => {
    if (!selectedId) return
    const t = transactions.find((x) => x.id === selectedId)
    if (t) openEdit(t)
    else alert('선택한 내역을 찾을 수 없습니다.')
  }

  const deleteSelected = () => {
    if (!selectedId) return
    handleDelete(selectedId)
    setSelectedId(null)
  }

  const openEdit = (t) => {
    setEditingId(t.id)
    const dateStr = getTransactionDateStr(t)
    const today = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
    setEditForm({
      category: t.category || '',
      content: t.content || '',
      amount: String(t.amount),
      date: dateStr || today,
    })
  }

  const closeEdit = () => {
    setEditingId(null)
    setEditForm({ category: '', content: '', amount: '', date: '' })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingId) return
    if (!db) {
      alert('Firebase가 설정되지 않았습니다. GitHub Actions 시크릿을 확인해 주세요.')
      return
    }
    const num = Number(editForm.amount)
    if (Number.isNaN(num)) return
    const type = num >= 0 ? 'plus' : 'minus'
    const dateStr = (editForm.date || '').trim() || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
    try {
      await updateDoc(doc(db, 'transactions', editingId), {
        category: editForm.category.trim(),
        content: editForm.content.trim(),
        amount: num,
        type,
        date: dateStr,
      })
      closeEdit()
    } catch (err) {
      console.error(err)
      alert('수정 실패: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('이 내역을 삭제할까요?')) return
    if (!db) {
      alert('Firebase가 설정되지 않았습니다. GitHub Actions 시크릿을 확인해 주세요.')
      return
    }
    try {
      await deleteDoc(doc(db, 'transactions', id))
    } catch (err) {
      console.error(err)
      alert('삭제 실패: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="toss-card p-8 text-center text-gray-400">
        불러오는 중...
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="toss-card p-8 text-center text-gray-400 text-sm mb-24">
        아직 등록된 내역이 없습니다. 하단 입력창에서 추가해보세요.
      </div>
    )
  }

  return (
    <>
      <div className="toss-card overflow-hidden mb-6 sm:mb-24 overflow-x-auto max-w-full min-w-0">
        {/* 표 위: 왼쪽 구분 필터, 오른쪽 수정/삭제 */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={() => setCategoryFilterOnly(ALL_CATEGORIES)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors touch-manipulation ${categoryFilter === ALL_CATEGORIES ? 'bg-[#3182f6] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              전체
            </button>
            {categoryOptions.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setCategoryFilterOnly(name)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors touch-manipulation whitespace-nowrap ${categoryFilter === name ? 'bg-[#3182f6] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openEditForSelected}
              disabled={!selectedId}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation"
            >
              <Pencil className="w-4 h-4" />
              수정
            </button>
            <button
              type="button"
              onClick={deleteSelected}
              disabled={!selectedId}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors touch-manipulation"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">구분</th>
                <th className="py-2.5 px-3 text-right">금액</th>
                <th className="py-2.5 px-3">날짜</th>
                <th className="py-2.5 px-3">내용</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => {
                const isPlus = (t.type || (t.amount >= 0)) === 'plus' || t.amount >= 0
                const amountStr = new Intl.NumberFormat('ko-KR').format(Math.abs(t.amount))
                const isSelected = selectedId === t.id
                return (
                  <tr
                    key={t.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedId((prev) => (prev === t.id ? null : t.id))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedId((prev) => (prev === t.id ? null : t.id))
                      }
                    }}
                    className={`border-b border-gray-50 transition-colors cursor-pointer touch-manipulation ${isSelected ? 'bg-blue-50/80 ring-1 ring-inset ring-blue-200' : 'hover:bg-gray-50/50'}`}
                  >
                    <td className="py-2.5 px-3 font-medium text-gray-800">{t.category || '-'}</td>
                    <td className={`py-2.5 px-3 text-right font-semibold ${isPlus ? 'text-blue-600' : 'text-red-600'}`}>
                      {isPlus ? '+' : '-'}${amountStr}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">
                      {formatDateDDMM(getTransactionDateStr(t) || t.createdAt)}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">{t.content || '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 수정 모달 */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeEdit}>
          <div
            className="toss-card w-full max-w-md p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">내역 수정</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">날짜</label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))}
                  className="toss-input w-full px-4 py-2.5"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">구분</label>
                <div className="relative">
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                    className="toss-input w-full px-4 py-2.5 text-base appearance-none bg-white pr-10"
                    required
                  >
                    {categoryOptions.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                    {!categoryOptions.includes(editForm.category) && editForm.category && (
                      <option value={editForm.category}>{editForm.category}</option>
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">내용</label>
                <input
                  type="text"
                  value={editForm.content}
                  onChange={(e) => setEditForm((p) => ({ ...p, content: e.target.value }))}
                  className="toss-input w-full px-4 py-2.5"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">금액</label>
                <input
                  type="text"
                  value={editForm.amount}
                  onChange={(e) => setEditForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="-5000 또는 1000"
                  className="toss-input w-full px-4 py-2.5"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#3182f6] text-white font-semibold hover:bg-[#1b64da]"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
