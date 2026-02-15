/**
 * Firestore에 transactions 컬렉션 생성
 * (첫 문서를 추가하면 컬렉션이 생깁니다)
 * 사용: npm run create-collection
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

async function createCollection() {
  const d = new Date()
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const docRef = await addDoc(collection(db, 'transactions'), {
    category: '시작',
    content: '컬렉션 생성',
    amount: 0,
    type: 'plus',
    date,
    createdAt: serverTimestamp(),
  })
  console.log('transactions 컬렉션이 생성되었습니다.')
  console.log('첫 문서 ID:', docRef.id)
  console.log('Firebase 콘솔에서 확인하세요: https://console.firebase.google.com/project/' + config.projectId + '/firestore')
  process.exit(0)
}

createCollection().catch((err) => {
  console.error('실패:', err.message)
  process.exit(1)
})
