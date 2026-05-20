import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAI3OCoO8gsHghjcUkK25-vCKXIOeHmeOM',
  authDomain: 'qiosk-2827b.firebaseapp.com',
  projectId: 'qiosk-2827b',
  storageBucket: 'qiosk-2827b.firebasestorage.app',
  messagingSenderId: '368574615779',
  appId: '1:368574615779:web:ecf7afb22282dd69f9f5d6',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
