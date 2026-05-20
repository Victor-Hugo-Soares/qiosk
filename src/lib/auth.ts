import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, googleProvider } from './firebase'

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

export function onAuthChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}
