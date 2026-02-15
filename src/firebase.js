import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
const hasConfig = typeof projectId === 'string' && projectId.trim() !== '' &&
  typeof apiKey === 'string' && apiKey.trim() !== ''

let app = null
let db = null
let analytics = null

if (hasConfig) {
  app = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  })
  db = getFirestore(app)
  if (typeof window !== 'undefined') analytics = getAnalytics(app)
}

export { db, analytics }
export const isFirebaseConfigured = !!db
