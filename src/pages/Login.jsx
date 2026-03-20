import React, { useState } from 'react'

// Credentials stored as env variables for security
// In production set VITE_USER and VITE_PASS in Vercel dashboard
const VALID_USER = import.meta.env.VITE_USER || 'jaime'
const VALID_PASS = import.meta.env.VITE_PASS || 'PsicoJaime2025!'

export default function Login({ onLogin }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [blocked, setBlocked] = useState(false)
  const [showPass, setShowPass] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (blocked) return

    if (user.trim() === VALID_USER && pass === VALID_PASS) {
      setError('')
      onLogin()
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      if (newAttempts >= 5) {
        setBlocked(true)
        setError('Demasiados intentos fallidos. Recarga la página para volver a intentarlo.')
        setTimeout(() => { setBlocked(false); setAttempts(0); setError('') }, 60000)
      } else {
        setError(`Usuario o contraseña incorrectos. Intento ${newAttempts} de 5.`)
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a6e 0%, #0f2044 100%)',
      padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '40px 36px',
        width: '100%', maxWidth: 400,
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🧠</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e3a6e', marginBottom: 4 }}>PsicoJaime</h1>
          <p style={{ fontSize: 13, color: '#6b7280' }}>Consulta de Psicología Online</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Usuario
            </label>
            <input
              type="text"
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="Tu nombre de usuario"
              autoComplete="username"
              style={{
                width: '100%', padding: '11px 14px', border: '1.5px solid #d1d5db',
                borderRadius: 9, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                transition: 'border-color .2s',
              }}
              onFocus={e => e.target.style.borderColor = '#1e3a6e'}
              onBlur={e => e.target.style.borderColor = '#d1d5db'}
              disabled={blocked}
            />
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder="Tu contraseña"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '11px 44px 11px 14px', border: '1.5px solid #d1d5db',
                  borderRadius: 9, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color .2s',
                }}
                onFocus={e => e.target.style.borderColor = '#1e3a6e'}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}
                disabled={blocked}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#9ca3af' }}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#991b1b', marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={blocked || !user || !pass}
            style={{
              width: '100%', padding: '12px', background: '#1e3a6e', color: '#fff',
              border: 'none', borderRadius: 9, fontSize: 15, fontWeight: 600,
              cursor: blocked || !user || !pass ? 'not-allowed' : 'pointer',
              opacity: blocked || !user || !pass ? 0.6 : 1,
              transition: 'opacity .2s',
            }}
          >
            {blocked ? '🔒 Acceso bloqueado' : 'Acceder →'}
          </button>
        </form>

        {/* RGPD notice */}
        <div style={{
          marginTop: 24, padding: '12px 14px', background: '#f0f9ff',
          border: '1px solid #bae6fd', borderRadius: 8, fontSize: 11, color: '#0369a1', lineHeight: 1.6,
        }}>
          🔒 <strong>Protección de datos:</strong> Este sistema contiene datos de salud protegidos por el
          RGPD (UE) 2016/679 y la LOPDGDD 3/2018. El acceso no autorizado constituye una infracción legal.
          La sesión se cierra automáticamente tras 30 minutos de inactividad.
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#d1d5db', marginTop: 20 }}>
          PsicoJaime © {new Date().getFullYear()} · Uso exclusivo profesional
        </p>
      </div>
    </div>
  )
}
