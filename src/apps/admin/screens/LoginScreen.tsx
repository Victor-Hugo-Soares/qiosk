'use client'
import { useState } from 'react'
import { signInWithGoogle } from '../../../lib/auth'

export default function LoginScreen() {
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  async function handleGoogle() {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      // onAuthStateChanged no AdminApp trata o redirect
    } catch (err: unknown) {
      const e = err as Error & { code?: string }
      const msg = e?.code || e?.message || String(err)
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#F4F3F0',
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 380,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{
          width: 56,
          height: 56,
          background: '#FF6B2B',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <span style={{ color: '#FFF', fontFamily: 'Figtree, sans-serif', fontWeight: 700, fontSize: 22 }}>Q</span>
        </div>

        <h1 style={{ fontFamily: 'Figtree, sans-serif', fontWeight: 700, fontSize: 24, color: '#1A1A2E', margin: '0 0 8px' }}>
          Painel QIOSK
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#888', margin: '0 0 32px' }}>
          Entra com a tua conta Google para continuar
        </p>

        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            width: '100%',
            padding: '14px 20px',
            background: loading ? '#F0F0F0' : '#FFFFFF',
            border: '1.5px solid #E0E0E0',
            borderRadius: 10,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 15,
            color: '#1A1A2E',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.borderColor = '#FF6B2B' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E0E0E0' }}
        >
          {/* Google icon SVG */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.08-6.08C34.46 3.04 29.52 1 24 1 14.82 1 7.07 6.52 3.64 14.27l7.07 5.49C12.4 13.53 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.74H24v8.98h12.7c-.55 2.96-2.2 5.47-4.68 7.15l7.18 5.58C43.46 37.6 46.52 31.55 46.52 24.5z"/>
            <path fill="#FBBC05" d="M10.71 28.24A14.54 14.54 0 0 1 9.5 24c0-1.48.25-2.91.71-4.24L3.14 14.27A23.93 23.93 0 0 0 1 24c0 3.87.93 7.53 2.64 10.73l7.07-6.49z"/>
            <path fill="#34A853" d="M24 47c5.52 0 10.15-1.83 13.52-4.97l-7.18-5.58c-1.82 1.22-4.15 1.95-6.34 1.95-6.26 0-11.6-4.03-13.29-9.76l-7.07 5.49C7.07 41.48 14.82 47 24 47z"/>
          </svg>
          {loading ? 'A entrar…' : 'Entrar com Google'}
        </button>

        {error && (
          <p style={{ marginTop: 16, fontSize: 13, color: '#E74C3C', fontFamily: 'Inter, sans-serif' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
