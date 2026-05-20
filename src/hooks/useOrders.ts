import { useEffect, useState } from 'react'
import { listenOrders } from '../lib/firestore'
import type { Order } from '../types'

/**
 * Hook de pedidos em tempo real via Firestore.
 * @param daysBack  Quantos dias atrás buscar (padrão: 1 = só hoje)
 */
export function useOrders(daysBack = 1): Order[] {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const since = new Date()
    since.setDate(since.getDate() - daysBack)
    since.setHours(0, 0, 0, 0)

    const unsub = listenOrders(since, setOrders)
    return unsub
  }, [daysBack])

  return orders
}
