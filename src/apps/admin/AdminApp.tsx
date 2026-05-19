import { Routes, Route, Navigate } from 'react-router-dom'
import AdminSidebar from './components/AdminSidebar'
import DashboardScreen from './screens/DashboardScreen'
import MenuScreen from './screens/MenuScreen'
import ProductFormScreen from './screens/ProductFormScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function AdminApp() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F3F0' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"          element={<DashboardScreen />} />
          <Route path="menu"               element={<MenuScreen />} />
          <Route path="menu/new"           element={<ProductFormScreen />} />
          <Route path="menu/edit/:id"      element={<ProductFormScreen />} />
          <Route path="settings"           element={<SettingsScreen />} />
          <Route path="*"                  element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}
