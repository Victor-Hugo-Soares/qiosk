'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { User } from 'firebase/auth'
import { onAuthChanged } from '../../src/lib/auth'
import AdminSidebar from '../../src/apps/admin/components/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router   = useRouter()
  const pathname = usePathname()
  const isLogin  = pathname === '/admin/login'

  useEffect(() => {
    return onAuthChanged((u) => {
      setUser(u)
      setLoading(false)
      if (!u && !isLogin) router.replace('/admin/login')
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F4F3F0' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', color: '#888', fontSize: 15 }}>A carregar…</span>
      </div>
    )
  }

  if (!user && !isLogin) return null

  if (isLogin) return <>{children}</>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F3F0' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
    </div>
  )
}
