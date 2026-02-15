import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const NEW_CATEGORY_VALUE = '__new__'

/** 오늘 날짜 YYYY-MM-DD */
export function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * { category, content, amount, date? } 객체로 Firestore에 저장
 * date 없으면 오늘. 금액 >= 0 이면 type: 'plus'
 */
export function useAddTransaction() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const addTransaction = async ({ category, content, amount, date }) => {
    const cat = (category || '').trim()
    const cont = (content || '').trim()
    const num = Number(amount)
    const dateStr = (date || getTodayStr()).trim() || getTodayStr()

    if (!cat) {
      setError('구분을 선택하거나 입력해주세요.')
      return { success: false }
    }
    if (cont === '') {
      setError('내용을 입력해주세요.')
      return { success: false }
    }
    if (Number.isNaN(num) || num === 0) {
      setError('올바른 금액을 입력해주세요.')
      return { success: false }
    }
    if (!db) {
      setError('Firebase가 설정되지 않았습니다. GitHub Actions 시크릿을 확인해 주세요.')
      return { success: false }
    }

    setError(null)
    setSubmitting(true)

    try {
      const type = num >= 0 ? 'plus' : 'minus'
      await addDoc(collection(db, 'transactions'), {
        category: cat,
        content: cont,
        amount: num,
        type,
        date: dateStr,
        createdAt: serverTimestamp(),
      })
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false }
    } finally {
      setSubmitting(false)
    }
  }

  return { addTransaction, submitting, error }
}

export { NEW_CATEGORY_VALUE }
