import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { User } from 'firebase/auth'
import { onAuthChanged } from '../../lib/auth'
import LoginScreen from './screens/LoginScreen'
import AdminSidebar from './components/AdminSidebar'
import DashboardScreen from './screens/DashboardScreen'
import MenuScreen from './screens/MenuScreen'
import ProductFormScreen from './screens/ProductFormScreen'
import CategoriesScreen from './screens/CategoriesScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function AdminApp() {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthChanged((u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F4F3F0' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', color: '#888', fontSize: 15 }}>A carregar…</span>
      </div>
    )
  }

  if (!user) return <LoginScreen />

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F3F0' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"     element={<DashboardScreen />} />
          <Route path="menu"          element={<MenuScreen />} />
          <Route path="menu/new"      element={<ProductFormScreen />} />
          <Route path="menu/edit/:id" element={<ProductFormScreen />} />
          <Route path="categories"    element={<CategoriesScreen />} />
          <Route path="settings"      element={<SettingsScreen />} />
          <Route path="*"             element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}
