import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ModePicker from './apps/ModePicker'
import KioskApp from './apps/kiosk/KioskApp'
import KitchenApp from './apps/kitchen/KitchenApp'
import AdminApp from './apps/admin/AdminApp'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModePicker />} />
        <Route path="/kiosk/*" element={<KioskApp />} />
        <Route path="/kitchen/*" element={<KitchenApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
