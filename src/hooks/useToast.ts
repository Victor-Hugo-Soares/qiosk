import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id:      string
  message: string
  type:    ToastType
  leaving: boolean
}

interface ToastStore {
  toasts: Toast[]
  toast:  (message: string, type?: ToastType) => void
  remove: (id: string) => void
  markLeaving: (id: string) => void
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],

  toast: (message, type = 'success') => {
    const id = crypto.randomUUID()
    set((s) => ({
      toasts: [...s.toasts, { id, message, type, leaving: false }],
    }))

    // Inicia saída em 2.7s, remove em 3s
    setTimeout(() => {
      set((s) => ({
        toasts: s.toasts.map((t) => t.id === id ? { ...t, leaving: true } : t),
      }))
    }, 2700)
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3000)
  },

  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  markLeaving: (id) => set((s) => ({
    toasts: s.toasts.map((t) => t.id === id ? { ...t, leaving: true } : t),
  })),
}))
