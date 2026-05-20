'use client'
import { useFirestoreSync } from '../src/hooks/useFirestoreSync'
import ToastContainer from '../src/components/ToastContainer'
import OfflineBanner from '../src/components/OfflineBanner'

export default function Providers({ children }: { children: React.ReactNode }) {
  useFirestoreSync()
  return (
    <>
      {children}
      <ToastContainer />
      <OfflineBanner />
    </>
  )
}
