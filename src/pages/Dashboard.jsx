import React from 'react'
import { Card, MetricCard, Badge, Avatar } from '../utils/ui.jsx'

function fmtDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function Dashboard({ patients, invoices, appointments, onNav }) {
  const today = new Date().toISOString().split('T')[0]
  const thisMonth = new Date().toISOString().slice(0, 7)
  const mInv = invoices.filter(i => i.date.startsWith(thisMonth))
  const mRev = mInv.filter(i => i.status === 'pagada').reduce((s, i) => s + i.amount, 0)
  const pendTotal = invoices.filter(i => i.status === 'pendiente').reduce((s, i) => s + i.amount, 0)
  const todayApts = appointments.filter(a => a.date === today)
  const nextApts = appointments.filter(a => a.date >= today).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).slice(0, 6)

  const sinDocs = patients.filter(p => !p.autorizacion || !p.consentimiento)

  // 6-month bar chart
  const now = new Date()
  const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  const bars = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
    const val = invoices.filter(x => x.date.startsWith(key) && x.status === 'pagada').reduce((s,x)=>s+x.amount,0)
    return { label: MONTHS[d.getMonth()], val, isCurrentMonth: i === 5 }
  })
  const maxBar = Math.max(...bars.map(b => b.val), 1)

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
          Buenos días, Jaime 👋
        </h2>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Alerta documentación */}
      {sinDocs.length > 0 && (
        <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 10, padding: '12px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div style={{ flex: 1, fontSize: 13, color: '#854d0e' }}>
            <strong>{sinDocs.length} paciente{sinDocs.length > 1 ? 's' : ''} sin documentación completa:</strong>{' '}
            {sinDocs.map(p => p.nombre.split(' ')[0]).join(', ')}
          </div>
          <button onClick={() => onNav('pacientes')} style={{ fontSize: 12, color: '#854d0e', background: 'none', border: '1px solid #fde047', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>
            Ver pacientes →
          </button>
        </div>
      )}

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <MetricCard label="Ingresos del mes" value={`${mRev}€`} sub={`${mInv.length} sesiones`} color="#1e3a6e" />
        <MetricCard label="Cobros pendientes" value={`${pendTotal}€`} sub={`${invoices.filter(i=>i.status==='pendiente').length} facturas`} color="#b45309" />
        <MetricCard label="Pacientes activos" value={patients.filter(p=>p.status==='activo').length} sub={`${patients.length} registrados`} color="#166534" />
        <MetricCard label="Citas hoy" value={todayApts.length} sub={todayApts[0] ? `Primera: ${todayApts[0].time}h` : 'Sin citas'} color="#7c3aed" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Bar chart */}
        <Card>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 20 }}>Ingresos últimos 6 meses</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 110 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                {b.val > 0 && <div style={{ fontSize: 10, color: '#9ca3af' }}>{b.val}€</div>}
                <div style={{ width: '100%', height: `${Math.max(Math.round((b.val/maxBar)*90),b.val?4:0)}px`, background: b.isCurrentMonth ? '#1e3a6e' : '#dbeafe', borderRadius: '4px 4px 0 0', transition: 'height .4s ease' }} />
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{b.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Próximas citas */}
        <Card>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 16 }}>Próximas citas</div>
          {nextApts.length ? nextApts.map((a, i) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < nextApts.length-1 ? '1px solid #f3f4f6' : 'none' }}>
              <Avatar name={a.patient} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{a.patient}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{fmtDate(a.date)} · {a.time}h</div>
              </div>
              <Badge variant="info">{a.duration}min</Badge>
            </div>
          )) : <p style={{ fontSize: 13, color: '#9ca3af' }}>Sin citas próximas programadas</p>}
        </Card>
      </div>
    </div>
  )
}
