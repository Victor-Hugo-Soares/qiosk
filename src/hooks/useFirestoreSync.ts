import { useEffect, useRef } from 'react'
import { listenCategories, listenProducts, listenSettings } from '../lib/firestore'
import { seedIfEmpty } from '../lib/seed'
import { useQioskStore } from '../store'

/**
 * Monta listeners Firestore para categorias, produtos e settings.
 * Deve ser usado uma vez no topo da app (App.tsx).
 */
export function useFirestoreSync() {
  const setCategories = useQioskStore((s) => s.setCategories)
  const setProducts   = useQioskStore((s) => s.setProducts)
  const setSettings   = useQioskStore((s) => s.setSettings)
  const seeded        = useRef(false)

  useEffect(() => {
    const unsubCats = listenCategories((cats) => {
      setCategories(cats)
      // Seed uma única vez se o Firestore estiver vazio
      if (!seeded.current) {
        seeded.current = true
        seedIfEmpty(cats.length).catch(console.error)
      }
    })
    const unsubProds = listenProducts(setProducts)
    const unsubSetts = listenSettings((s) => { if (s) setSettings(s) })

    return () => {
      unsubCats()
      unsubProds()
      unsubSetts()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
