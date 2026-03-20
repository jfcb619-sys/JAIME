import React from 'react'

const NAV = [
  { id: 'dashboard',     icon: '📊', label: 'Dashboard' },
  { id: 'pacientes',     icon: '👤', label: 'Pacientes' },
  { id: 'agenda',        icon: '📅', label: 'Agenda' },
  { id: 'facturacion',   icon: '🧾', label: 'Facturación' },
  { id: 'finanzas',      icon: '📈', label: 'Finanzas' },
  { id: 'recordatorios', icon: '💬', label: 'Recordatorios' },
]

export default function Layout({ children, section, onNav, onLogout }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: '#0f2044', display: 'flex', flexDirection: 'column',
        flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>🧠</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>PsicoJaime</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Consulta Online</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => onNav(n.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8, border: 'none',
                background: section === n.id ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: section === n.id ? '#fff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', fontSize: 13, fontWeight: section === n.id ? 600 : 400,
                fontFamily: 'inherit', marginBottom: 2, textAlign: 'left',
                transition: 'all .15s',
              }}
              onMouseEnter={e => { if (section !== n.id) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { if (section !== n.id) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
              {section === n.id && <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: '#60a5fa' }} />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>
            🔒 Sesión activa<br />
            <span style={{ fontSize: 10 }}>Cierre automático: 30 min</span>
          </div>
          <button
            onClick={onLogout}
            style={{
              width: '100%', padding: '8px', background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: 7,
              color: '#fca5a5', cursor: 'pointer', fontSize: 12, fontWeight: 500,
              fontFamily: 'inherit',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>
        {children}
      </main>
    </div>
  )
}
