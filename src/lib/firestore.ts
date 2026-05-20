import {
  collection, doc, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, where, orderBy,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Category, Order, OrderStatus, Product, StoreSettings } from '../types'

/** Remove campos undefined (Firestore não aceita undefined) */
function stripUndefined<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function saveOrder(order: Order): Promise<void> {
  return setDoc(doc(db, 'orders', order.id), stripUndefined(order))
}

export function updateOrderStatusFS(orderId: string, status: OrderStatus): Promise<void> {
  return updateDoc(doc(db, 'orders', orderId), {
    status,
    updatedAt: new Date().toISOString(),
  })
}

export function listenOrders(since: Date, cb: (orders: Order[]) => void): () => void {
  const q = query(
    collection(db, 'orders'),
    where('createdAt', '>=', since.toISOString()),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as Order)))
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function saveCategoryFS(category: Category): Promise<void> {
  return setDoc(doc(db, 'categories', category.id), category)
}

export function updateCategoryFS(id: string, patch: Partial<Category>): Promise<void> {
  return updateDoc(doc(db, 'categories', id), patch)
}

export function deleteCategoryFS(id: string): Promise<void> {
  return deleteDoc(doc(db, 'categories', id))
}

export function listenCategories(cb: (cats: Category[]) => void): () => void {
  const q = query(collection(db, 'categories'), orderBy('order', 'asc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as Category)))
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function saveProductFS(product: Product): Promise<void> {
  return setDoc(doc(db, 'products', product.id), stripUndefined(product))
}

export function updateProductFS(id: string, patch: Partial<Product>): Promise<void> {
  return updateDoc(doc(db, 'products', id), stripUndefined(patch))
}

export function deleteProductFS(id: string): Promise<void> {
  return deleteDoc(doc(db, 'products', id))
}

export function listenProducts(cb: (products: Product[]) => void): () => void {
  return onSnapshot(collection(db, 'products'), (snap) =>
    cb(snap.docs.map((d) => d.data() as Product))
  )
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function saveSettingsFS(settings: Partial<StoreSettings>): Promise<void> {
  return setDoc(doc(db, 'settings', 'main'), settings, { merge: true })
}

export function listenSettings(cb: (s: StoreSettings | null) => void): () => void {
  return onSnapshot(doc(db, 'settings', 'main'), (snap) =>
    cb(snap.exists() ? (snap.data() as StoreSettings) : null)
  )
}
