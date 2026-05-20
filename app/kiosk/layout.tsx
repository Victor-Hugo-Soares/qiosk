'use client'
import { useEffect, Suspense } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useQioskStore } from '../../src/store'

const IDLE_TIMEOUT_MS = 90_000

function KioskLayoutInner({ children }: { children: React.ReactNode }) {
  const router         = useRouter()
  const pathname       = usePathname()
  const searchParams   = useSearchParams()
  const isIdle         = pathname === '/kiosk/idle'
  const acceptingOrders = useQioskStore((s) => s.settings.acceptingOrders)
  const setTableNumber  = useQioskStore((s) => s.setTableNumber)

  useEffect(() => {
    const t = searchParams.get('table')
    setTableNumber(t ? Number(t) : null)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!acceptingOrders && !isIdle) router.replace('/kiosk/idle')
  }, [acceptingOrders, isIdle, router])

  useEffect(() => {
    if (isIdle || pathname.includes('confirmation')) return
    let timer = setTimeout(() => router.push('/kiosk/idle'), IDLE_TIMEOUT_MS)
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(() => router.push('/kiosk/idle'), IDLE_TIMEOUT_MS)
    }
    window.addEventListener('pointerdown', reset)
    window.addEventListener('pointermove', reset)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('pointerdown', reset)
      window.removeEventListener('pointermove', reset)
    }
  }, [pathname, isIdle, router])

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F4', overflowX: 'hidden' }}>
      {children}
    </div>
  )
}

export default function KioskLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children && <KioskLayoutInner>{children}</KioskLayoutInner>}</Suspense>
}
