'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { User } from 'firebase/auth'
import { onAuthChanged, signOut } from '../../src/lib/auth'
import AdminSidebar from '../../src/apps/admin/components/AdminSidebar'

const ALLOWED_EMAIL = 'vsoareslins452@gmail.com'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [denied, setDenied]   = useState(false)
  const router   = useRouter()
  const pathname = usePathname()
  const isLogin  = pathname === '/admin/login'

  useEffect(() => {
    return onAuthChanged(async (u) => {
      if (u && u.email !== ALLOWED_EMAIL) {
        await signOut()
        setDenied(true)
        setLoading(false)
        return
      }
      setUser(u)
      setDenied(false)
      setLoading(false)
      if (u && isLogin)   router.replace('/admin/dashboard')
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

  if (denied) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F4F3F0', gap: 12 }}>
        <span style={{ fontSize: 32 }}>🔒</span>
        <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18, color: '#1A1A2E', margin: 0 }}>Acesso negado</p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#888', margin: 0 }}>Esta conta não tem permissão para aceder ao painel.</p>
        <button onClick={() => router.replace('/admin/login')} style={{ marginTop: 8, padding: '10px 24px', background: '#FF6B2B', color: '#FFF', border: 'none', borderRadius: 8, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
          Tentar com outra conta
        </button>
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
