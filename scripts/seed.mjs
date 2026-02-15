/**
 * Firestore transactions 컬렉션에 샘플 데이터 추가
 * 사용: npm run seed (프로젝트 루트에서 실행, .env 설정 필요)
 */
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const envPath = join(root, '.env')

if (!existsSync(envPath)) {
  console.error('.env 파일이 없습니다. FIREBASE_SETUP.md를 참고해 Firebase 설정 후 .env를 만드세요.')
  process.exit(1)
}

const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map((line) => {
      const i = line.indexOf('=')
      return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^["']|["']$/g, '')]
    })
)

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

if (!config.apiKey || !config.projectId) {
  console.error('.env에 VITE_FIREBASE_* 값이 모두 있는지 확인하세요.')
  process.exit(1)
}

const app = initializeApp(config)
const db = getFirestore(app)

const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const samples = [
  { category: 'Peony', content: '프린터', amount: 1000, type: 'plus' },
  { category: 'Peony', content: '소모품', amount: -500, type: 'minus' },
  { category: '비용', content: '점심', amount: -8000, type: 'minus' },
  { category: '수입', content: '프리랜스', amount: 150000, type: 'plus' },
  { category: '나간 돈', content: '주식 매수', amount: -100000, type: 'minus' },
]

async function seed() {
  const date = todayStr()
  console.log('Firestore에 샘플 데이터 추가 중...')
  for (const item of samples) {
    await addDoc(collection(db, 'transactions'), {
      ...item,
      date,
      createdAt: serverTimestamp(),
    })
    console.log(`  추가: ${item.category} | ${item.content} | ${item.amount}`)
  }
  console.log('완료. 앱에서 목록을 확인하세요.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('실패:', err.message)
  process.exit(1)
})
