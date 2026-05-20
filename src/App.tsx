import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ModePicker from './apps/ModePicker'
import KioskApp from './apps/kiosk/KioskApp'
import KitchenApp from './apps/kitchen/KitchenApp'
import AdminApp from './apps/admin/AdminApp'
import { useFirestoreSync } from './hooks/useFirestoreSync'
import ToastContainer from './components/ToastContainer'
import OfflineBanner from './components/OfflineBanner'

function AppRoutes() {
  useFirestoreSync()
  return (
    <Routes>
      <Route path="/" element={<ModePicker />} />
      <Route path="/kiosk/*" element={<KioskApp />} />
      <Route path="/kitchen/*" element={<KitchenApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer />
      <OfflineBanner />
    </BrowserRouter>
  )
}
