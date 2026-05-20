import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useQioskStore } from '../../store'
import { useSearchParams } from 'react-router-dom'
import IdleScreen from './screens/IdleScreen'
import CategoriesScreen from './screens/CategoriesScreen'
import ProductsScreen from './screens/ProductsScreen'
import ProductDetailScreen from './screens/ProductDetailScreen'
import CartScreen from './screens/CartScreen'
import PaymentScreen from './screens/PaymentScreen'
import PixScreen from './screens/PixScreen'
import ConfirmationScreen from './screens/ConfirmationScreen'

const IDLE_TIMEOUT_MS = 90_000 // 90s sem interação → volta pro idle

export default function KioskApp() {
  const navigate        = useNavigate()
  const location        = useLocation()
  const [searchParams]  = useSearchParams()
  const isIdle          = location.pathname === '/kiosk/idle'
  const acceptingOrders = useQioskStore((s) => s.settings.acceptingOrders)
  const setTableNumber  = useQioskStore((s) => s.setTableNumber)

  // Captura ?table=X da URL ao montar (QR Code mode)
  useEffect(() => {
    const t = searchParams.get('table')
    setTableNumber(t ? Number(t) : null)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Se a loja fechar no meio do fluxo, retorna para o idle imediatamente
  useEffect(() => {
    if (!acceptingOrders && !isIdle) {
      navigate('/kiosk/idle', { replace: true })
    }
  }, [acceptingOrders, isIdle, navigate])

  // Idle timeout — só ativo fora da tela idle e da confirmação
  useEffect(() => {
    if (isIdle || location.pathname.includes('confirmation')) return

    let timer = setTimeout(() => navigate('/kiosk/idle'), IDLE_TIMEOUT_MS)

    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(() => navigate('/kiosk/idle'), IDLE_TIMEOUT_MS)
    }

    window.addEventListener('pointerdown', reset)
    window.addEventListener('pointermove', reset)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('pointerdown', reset)
      window.removeEventListener('pointermove', reset)
    }
  }, [location.pathname, isIdle, navigate])

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F4', overflowX: 'hidden' }}>
      <Routes>
        <Route index element={<Navigate to="idle" replace />} />
        <Route path="idle"           element={<IdleScreen />} />
        <Route path="categories"     element={<CategoriesScreen />} />
        <Route path="products/:categoryId" element={<ProductsScreen />} />
        <Route path="product/:productId"   element={<ProductDetailScreen />} />
        <Route path="cart"           element={<CartScreen />} />
        <Route path="payment"        element={<PaymentScreen />} />
        <Route path="pix"            element={<PixScreen />} />
        <Route path="confirmation"   element={<ConfirmationScreen />} />
        <Route path="*"              element={<Navigate to="idle" replace />} />
      </Routes>
    </div>
  )
}
