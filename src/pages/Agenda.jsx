import React, { useState } from 'react'
import { Btn, Badge, Card, Input, Select, Textarea, Modal, Avatar, PageHeader } from '../utils/ui.jsx'

const HOURS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00']
const BLANK = { patientId: '', date: new Date().toISOString().split('T')[0], time: '10:00', duration: '50', type: 'individual', notes: '' }

function fmtDateLong(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
function isToday(d) { return d === new Date().toISOString().split('T')[0] }
function isTomorrow(d) { const t = new Date(); t.setDate(t.getDate()+1); return d === t.toISOString().split('T')[0] }

export default function Agenda({ patients, appointments, setAppointments, onToast }) {
  const [showForm, setShowForm] = useState(false)
  const [f, setF] = useState(BLANK)
  const u = k => e => setF({ ...f, [k]: e.target.value })

  function addAppt() {
    const p = patients.find(p => p.id === Number(f.patientId))
    if (!p) return
    setAppointments([...appointments, { ...f, id: Date.now(), patient: p.nombre, patientId: Number(f.patientId), duration: Number(f.duration) }])
    setShowForm(false)
    setF(BLANK)
    onToast('✓ Cita añadida')
  }

  function deleteAppt(id) {
    if (window.confirm('¿Eliminar esta cita?')) {
      setAppointments(appointments.filter(a => a.id !== id))
      onToast('✓ Cita eliminada')
    }
  }

  const sorted = appointments.slice().sort((a,b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  const grouped = sorted.reduce((acc, a) => { (acc[a.date] = acc[a.date] || []).push(a); return acc }, {})
  const upcoming = Object.keys(grouped).filter(d => d >= new Date().toISOString().split('T')[0]).sort()
  const past = Object.keys(grouped).filter(d => d < new Date().toISOString().split('T')[0]).sort().reverse()

  function DateGroup({ date, apts }) {
    const label = isToday(date) ? '🟢 Hoy' : isTomorrow(date) ? '🔵 Mañana' : fmtDateLong(date)
    return (
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: isToday(date) ? '#166534' : isTomorrow(date) ? '#1e40af' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          {label}
        </div>
        <Card noPad>
          {apts.map((a, i) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < apts.length-1 ? '1px solid #f9fafb' : 'none' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1e3a6e', minWidth: 52 }}>{a.time}</div>
              <div style={{ width: 2, height: 36, background: '#dbeafe', borderRadius: 2, flexShrink: 0 }} />
              <Avatar name={a.patient} size={34} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{a.patient}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{a.type} · {a.duration} min{a.notes ? ` · ${a.notes}` : ''}</div>
              </div>
              <Badge variant="info">{a.duration}min</Badge>
              <button onClick={() => deleteAppt(a.id)} style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: 18, padding: '0 4px' }} title="Eliminar">✕</button>
            </div>
          ))}
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Agenda" sub={`${appointments.length} citas programadas`} action={<Btn variant="primary" onClick={() => setShowForm(true)}>+ Nueva cita</Btn>} />

      {upcoming.length === 0 && <Card style={{ textAlign: 'center', padding: 40, color: '#9ca3af', fontSize: 13 }}>Sin citas próximas. Añade la primera cita con el botón de arriba.</Card>}
      {upcoming.map(d => <DateGroup key={d} date={d} apts={grouped[d]} />)}

      {past.length > 0 && (
        <details style={{ marginTop: 24 }}>
          <summary style={{ cursor: 'pointer', fontSize: 13, color: '#9ca3af', fontWeight: 500, marginBottom: 12 }}>📁 Citas pasadas ({past.reduce((s,d) => s + grouped[d].length, 0)})</summary>
          {past.map(d => <DateGroup key={d} date={d} apts={grouped[d]} />)}
        </details>
      )}

      {showForm && (
        <Modal title="Nueva cita" onClose={() => setShowForm(false)}
          footer={<><Btn variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Btn><Btn variant="primary" onClick={addAppt} disabled={!f.patientId}>Guardar</Btn></>}>
          <Select label="Paciente *" value={f.patientId} onChange={u('patientId')}>
            <option value="">Seleccionar paciente…</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </Select>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Fecha *" type="date" value={f.date} onChange={u('date')} />
            <Select label="Hora *" value={f.time} onChange={u('time')}>
              {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
            </Select>
            <Input label="Duración (minutos)" type="number" value={f.duration} onChange={u('duration')} min="10" max="120" />
            <Select label="Tipo de sesión" value={f.type} onChange={u('type')}>
              {['individual','pareja','familia','grupo','supervisión','primera consulta'].map(o => <option key={o}>{o}</option>)}
            </Select>
          </div>
          <Textarea label="Notas (opcional)" value={f.notes} onChange={u('notes')} placeholder="Observaciones, recordatorios…" style={{ minHeight: 60 }} />
        </Modal>
      )}
    </div>
  )
}
