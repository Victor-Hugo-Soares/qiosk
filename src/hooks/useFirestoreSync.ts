import { useEffect, useRef } from 'react'
import { listenCategories, listenProducts, listenSettings } from '../lib/firestore'
import { seedIfEmpty, migrateProductImages, migrateSettings } from '../lib/seed'
import { useQioskStore } from '../store'

/**
 * Monta listeners Firestore para categorias, produtos e settings.
 * Deve ser usado uma vez no topo da app (App.tsx).
 */
export function useFirestoreSync() {
  const setCategories = useQioskStore((s) => s.setCategories)
  const setProducts   = useQioskStore((s) => s.setProducts)
  const setSettings   = useQioskStore((s) => s.setSettings)
  const setSynced     = useQioskStore((s) => s.setSynced)
  const seeded        = useRef(false)
  const syncedRef     = useRef(false)

  useEffect(() => {
    const unsubCats = listenCategories((cats) => {
      setCategories(cats)
      if (!seeded.current) {
        seeded.current = true
        seedIfEmpty(cats.length).catch(console.error)
      }
      // Marca como sincronizado na primeira resposta do Firestore
      if (!syncedRef.current) {
        syncedRef.current = true
        setSynced(true)
      }
    })
    const unsubProds = listenProducts((prods) => {
      setProducts(prods)
      migrateProductImages(prods).catch(console.error)
    })
    const unsubSetts = listenSettings((s) => {
      if (s) {
        migrateSettings(s as unknown as Record<string, unknown>).catch(console.error)
        setSettings(s)
      }
    })

    return () => {
      unsubCats()
      unsubProds()
      unsubSetts()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
