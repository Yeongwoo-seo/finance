import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'

/**
 * Firestore 'transactions' 컬렉션 실시간 구독
 * @returns { { transactions: Array, loading: boolean, error: Error | null } }
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!db) {
      setError(new Error('Firebase가 설정되지 않았습니다. GitHub Actions 시크릿을 확인해 주세요.'))
      setLoading(false)
      return
    }
    const q = query(
      collection(db, 'transactions'),
      orderBy('createdAt', 'desc')
    )
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => {
          const data = d.data()
          return {
            ...data,
            id: d.id,
            createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt,
          }
        })
        setTransactions(list)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  return { transactions, loading, error }
}
