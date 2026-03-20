import React, { useState } from 'react'
import { Btn, Badge, Card, Input, Select, Textarea, Modal, SectionTitle, Avatar, PageHeader } from '../utils/ui.jsx'
import { DSM5 } from '../data/dsm5.js'
import { generarAutorizacion, generarConsentimiento, descargarDocumento, previsualizarDocumento } from '../utils/documents.js'

const BLANK = {
  nombre:'', dni:'', fechaNacimiento:'', sexo:'Mujer', telefono:'', email:'',
  direccion:'', ocupacion:'', estadoCivil:'Soltero/a', contactoEmergencia:'',
  motivoConsulta:'', antecedentesFamiliares:'', antecedentesPersonales:'',
  medicacion:'Ninguna', modalidad:'Online', idiomasSesion:'Español',
  objetivosTerapeuticos:'', diagnosis:'',
  since: new Date().toISOString().split('T')[0], status:'activo',
}

function InfoCell({ label, value, full }) {
  return (
    <div style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px', gridColumn: full ? '1/-1' : 'auto' }}>
      <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#111827' }}>{value || <em style={{ color: '#d1d5db' }}>—</em>}</div>
    </div>
  )
}

function PatientForm({ initial, patients, onSave, onClose, title }) {
  const [f, setF] = useState(initial)
  const u = k => e => setF({ ...f, [k]: e.target.value })
  return (
    <Modal title={title} onClose={onClose} maxWidth={680}
      footer={<><Btn variant="ghost" onClick={onClose}>Cancelar</Btn><Btn variant="primary" onClick={() => onSave(f)}>Guardar</Btn></>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Nombre completo *" value={f.nombre} onChange={u('nombre')} placeholder="Nombre y apellidos" />
        <Input label="DNI / NIE *" value={f.dni} onChange={u('dni')} placeholder="12345678A" />
        <Input label="Fecha de nacimiento" type="date" value={f.fechaNacimiento} onChange={u('fechaNacimiento')} />
        <Select label="Sexo" value={f.sexo} onChange={u('sexo')}>
          {['Mujer','Hombre','No binario','Prefiero no indicarlo'].map(o=><option key={o}>{o}</option>)}
        </Select>
        <Input label="Teléfono" value={f.telefono} onChange={u('telefono')} placeholder="6XX XXX XXX" />
        <Input label="Email" type="email" value={f.email} onChange={u('email')} />
      </div>
      <Input label="Dirección" value={f.direccion} onChange={u('direccion')} placeholder="Calle, número, ciudad" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Input label="Ocupación" value={f.ocupacion} onChange={u('ocupacion')} />
        <Select label="Estado civil" value={f.estadoCivil} onChange={u('estadoCivil')}>
          {['Soltero/a','Casado/a','Pareja de hecho','Separado/a','Divorciado/a','Viudo/a'].map(o=><option key={o}>{o}</option>)}
        </Select>
        <Input label="Contacto de emergencia" value={f.contactoEmergencia} onChange={u('contactoEmergencia')} placeholder="Nombre – teléfono" />
        <Input label="En consulta desde" type="date" value={f.since} onChange={u('since')} />
        <Select label="Modalidad" value={f.modalidad} onChange={u('modalidad')}>
          {['Online','Presencial','Mixta'].map(o=><option key={o}>{o}</option>)}
        </Select>
        <Select label="Estado" value={f.status} onChange={u('status')}>
          {['activo','alta','en pausa','lista de espera'].map(o=><option key={o}>{o}</option>)}
        </Select>
      </div>
      <Textarea label="Motivo de consulta" value={f.motivoConsulta} onChange={u('motivoConsulta')} style={{ minHeight: 70 }} />
      <Select label="Diagnóstico DSM-5 / CIE-11" value={f.diagnosis} onChange={u('diagnosis')}>
        <option value="">Sin diagnóstico / En evaluación</option>
        {DSM5.map(d => <option key={d} value={d}>{d}</option>)}
      </Select>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Textarea label="Antecedentes familiares" value={f.antecedentesFamiliares} onChange={u('antecedentesFamiliares')} style={{ minHeight: 60 }} />
        <Textarea label="Antecedentes personales" value={f.antecedentesPersonales} onChange={u('antecedentesPersonales')} style={{ minHeight: 60 }} />
      </div>
      <Input label="Medicación actual" value={f.medicacion} onChange={u('medicacion')} placeholder="Ninguna / especificar fármaco y dosis" />
      <Textarea label="Objetivos terapéuticos" value={f.objetivosTerapeuticos} onChange={u('objetivosTerapeuticos')} style={{ minHeight: 60 }} />
    </Modal>
  )
}

export default function Pacientes({ patients, setPatients, onToast }) {
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('info')
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [noteForm, setNoteForm] = useState({ fecha: new Date().toISOString().split('T')[0], evolucion: 'estable', objetivos: '', contenido: '', tareas: '' })
  const [search, setSearch] = useState('')

  const filtered = patients.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) || p.dni.includes(search)
  )

  function saveNew(f) {
    const p = { ...f, id: Date.now(), sessions: 0, balance: 0, notes: [], autorizacion: false, consentimiento: false }
    setPatients([...patients, p])
    setShowForm(false)
    onToast('✓ Paciente registrado')
  }

  function saveEdit(f) {
    const updated = patients.map(p => p.id === selected.id ? { ...p, ...f } : p)
    setPatients(updated)
    setSelected({ ...selected, ...f })
    setEditMode(false)
    onToast('✓ Datos actualizados')
  }

  function addNote() {
    const note = { ...noteForm, id: Date.now() }
    const updated = patients.map(p => p.id === selected.id ? { ...p, notes: [...(p.notes||[]), note], sessions: p.sessions + 1 } : p)
    setPatients(updated)
    setSelected(prev => ({ ...prev, notes: [...(prev.notes||[]), note], sessions: prev.sessions + 1 }))
    setNoteForm({ fecha: new Date().toISOString().split('T')[0], evolucion: 'estable', objetivos: '', contenido: '', tareas: '' })
    onToast('✓ Nota de sesión guardada')
  }

  function toggleDoc(tipo, val) {
    const updated = patients.map(p => p.id === selected.id ? { ...p, [tipo]: val } : p)
    setPatients(updated)
    setSelected(prev => ({ ...prev, [tipo]: val }))
    onToast(val ? `✓ ${tipo === 'autorizacion' ? 'RGPD' : 'Consentimiento'} marcado como firmado` : '↩ Desmarcado')
  }

  const evColor = { mejora: '#166534', estable: '#1e40af', empeora: '#991b1b' }
  const evBg    = { mejora: '#dcfce7', estable: '#dbeafe', empeora: '#fee2e2' }

  if (selected) {
    const p = selected
    const tabs = [
      { id: 'info',       label: '👤 Datos' },
      { id: 'historia',   label: '📋 Historia' },
      { id: 'notas',      label: `📝 Notas (${(p.notes||[]).length})` },
      { id: 'evolucion',  label: '📈 Evolución' },
      { id: 'documentos', label: '📄 Documentos' },
    ]
    return (
      <div>
        <button onClick={() => { setSelected(null); setTab('info') }} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 13, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 5 }}>
          ← Volver a pacientes
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Avatar name={p.nombre} size={52} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 21, fontWeight: 700, color: '#111827', marginBottom: 5 }}>{p.nombre}</h2>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              <Badge variant={p.status === 'activo' ? 'success' : 'warning'}>{p.status}</Badge>
              <Badge variant={p.autorizacion ? 'success' : 'danger'}>{p.autorizacion ? '✓ RGPD' : '✗ RGPD pendiente'}</Badge>
              <Badge variant={p.consentimiento ? 'success' : 'danger'}>{p.consentimiento ? '✓ CI firmado' : '✗ CI pendiente'}</Badge>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, textAlign: 'center' }}>
            <div><div style={{ fontSize: 22, fontWeight: 700, color: '#1e3a6e' }}>{p.sessions}</div><div style={{ fontSize: 11, color: '#9ca3af' }}>sesiones</div></div>
            <div><div style={{ fontSize: 22, fontWeight: 700, color: p.balance < 0 ? '#dc2626' : '#16a34a' }}>{p.balance}€</div><div style={{ fontSize: 11, color: '#9ca3af' }}>saldo</div></div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 2, background: '#f3f4f6', padding: 3, borderRadius: 10, marginBottom: 22, width: 'fit-content', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#111827' : '#6b7280', fontWeight: tab === t.id ? 600 : 400, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB: INFO */}
        {tab === 'info' && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <Btn onClick={() => setEditMode(true)}>✏️ Editar datos</Btn>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <InfoCell label="Nombre completo" value={p.nombre} />
              <InfoCell label="DNI / NIE" value={p.dni} />
              <InfoCell label="Fecha de nacimiento" value={p.fechaNacimiento} />
              <InfoCell label="Sexo" value={p.sexo} />
              <InfoCell label="Teléfono" value={p.telefono} />
              <InfoCell label="Email" value={p.email} />
              <InfoCell label="Estado civil" value={p.estadoCivil} />
              <InfoCell label="Ocupación" value={p.ocupacion} />
              <InfoCell label="Dirección" value={p.direccion} full />
              <InfoCell label="Contacto de emergencia" value={p.contactoEmergencia} full />
              <InfoCell label="Modalidad" value={p.modalidad} />
              <InfoCell label="En consulta desde" value={p.since} />
              <InfoCell label="Diagnóstico DSM-5/CIE-11" value={p.diagnosis} full />
            </div>
          </Card>
        )}

        {/* TAB: HISTORIA */}
        {tab === 'historia' && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <Btn onClick={() => setEditMode(true)}>✏️ Editar historia</Btn>
            </div>
            {[
              ['Motivo de consulta', p.motivoConsulta],
              ['Objetivos terapéuticos', p.objetivosTerapeuticos],
              ['Antecedentes familiares', p.antecedentesFamiliares],
              ['Antecedentes personales', p.antecedentesPersonales],
              ['Medicación actual', p.medicacion],
              ['Diagnóstico DSM-5/CIE-11', p.diagnosis],
            ].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, borderBottom: '1px solid #f3f4f6', paddingBottom: 6, marginBottom: 10 }}>{label}</div>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>{val || <em style={{ color: '#d1d5db' }}>No registrado</em>}</p>
              </div>
            ))}
          </Card>
        )}

        {/* TAB: NOTAS */}
        {tab === 'notas' && (
          <div>
            <Card style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>Nueva nota de sesión</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Input label="Fecha" type="date" value={noteForm.fecha} onChange={e => setNoteForm({...noteForm, fecha: e.target.value})} />
                <Select label="Evolución" value={noteForm.evolucion} onChange={e => setNoteForm({...noteForm, evolucion: e.target.value})}>
                  <option value="mejora">↑ Mejora</option>
                  <option value="estable">→ Estable</option>
                  <option value="empeora">↓ Empeora</option>
                </Select>
              </div>
              <Input label="Objetivos / temas trabajados en sesión" value={noteForm.objetivos} onChange={e => setNoteForm({...noteForm, objetivos: e.target.value})} placeholder="Reestructuración cognitiva, regulación emocional, exposición…" />
              <Textarea label="Contenido de la sesión" value={noteForm.contenido} onChange={e => setNoteForm({...noteForm, contenido: e.target.value})} placeholder="Observaciones, intervenciones, aspectos relevantes…" style={{ minHeight: 100 }} />
              <Input label="Tareas para casa" value={noteForm.tareas} onChange={e => setNoteForm({...noteForm, tareas: e.target.value})} placeholder="Registro de pensamientos, ejercicios de respiración…" />
              <Btn variant="primary" onClick={addNote}>+ Guardar nota</Btn>
            </Card>
            {!(p.notes||[]).length && <p style={{ textAlign: 'center', color: '#9ca3af', padding: 30, fontSize: 13 }}>Sin notas de sesión todavía</p>}
            {(p.notes||[]).slice().reverse().map((n, i) => (
              <Card key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Sesión del {n.fecha}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 20, background: evBg[n.evolucion], color: evColor[n.evolucion] }}>
                    {n.evolucion === 'mejora' ? '↑ Mejora' : n.evolucion === 'empeora' ? '↓ Empeora' : '→ Estable'}
                  </span>
                </div>
                {n.objetivos && <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>🎯 {n.objetivos}</div>}
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.65, marginBottom: 8 }}>{n.contenido || '—'}</p>
                {n.tareas && <div style={{ fontSize: 12, color: '#374151', background: '#f0fdf4', padding: '7px 12px', borderRadius: 7, border: '1px solid #bbf7d0' }}>📋 Tarea: {n.tareas}</div>}
              </Card>
            ))}
          </div>
        )}

        {/* TAB: EVOLUCIÓN */}
        {tab === 'evolucion' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 18 }}>
              {[
                { label: 'Sesiones con mejora',  val: (p.notes||[]).filter(n=>n.evolucion==='mejora').length,  color: '#166534', bg: '#dcfce7' },
                { label: 'Sesiones estables',     val: (p.notes||[]).filter(n=>n.evolucion==='estable').length, color: '#1e40af', bg: '#dbeafe' },
                { label: 'Sesiones con empeora',  val: (p.notes||[]).filter(n=>n.evolucion==='empeora').length, color: '#991b1b', bg: '#fee2e2' },
              ].map(m => (
                <div key={m.label} style={{ background: m.bg, border: `1px solid transparent`, borderRadius: 10, padding: '16px 18px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: m.color }}>{m.val}</div>
                  <div style={{ fontSize: 12, color: m.color, marginTop: 3 }}>{m.label}</div>
                </div>
              ))}
            </div>
            <Card>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Línea de evolución</div>
              {!(p.notes||[]).length
                ? <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: 20 }}>Sin datos de evolución</p>
                : (p.notes||[]).map((n, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: evColor[n.evolucion], flexShrink: 0 }} />
                      {i < (p.notes||[]).length - 1 && <div style={{ width: 2, flex: 1, background: '#f3f4f6', minHeight: 20 }} />}
                    </div>
                    <div style={{ paddingBottom: 8 }}>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>
                        {n.fecha} · <span style={{ color: evColor[n.evolucion], fontWeight: 600 }}>{n.evolucion}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#374151' }}>{n.contenido?.slice(0, 100)}{n.contenido?.length > 100 ? '…' : ''}</div>
                    </div>
                  </div>
                ))}
            </Card>
          </div>
        )}

        {/* TAB: DOCUMENTOS */}
        {tab === 'documentos' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              {
                tipo: 'autorizacion', titulo: 'Autorización de datos (RGPD)',
                desc: 'Documento de autorización para el tratamiento de datos personales de salud. Conforme al RGPD (UE) 2016/679 y la LOPDGDD 3/2018.',
                color: '#1e3a6e', field: 'autorizacion',
              },
              {
                tipo: 'consentimiento', titulo: 'Consentimiento Informado',
                desc: 'Documento de consentimiento para el inicio del tratamiento psicológico. Incluye información sobre el proceso, confidencialidad, honorarios y derechos.',
                color: '#1a5c3a', field: 'consentimiento',
              },
            ].map(doc => (
              <Card key={doc.tipo}>
                <div style={{ fontSize: 15, fontWeight: 600, color: doc.color, marginBottom: 8 }}>{doc.titulo}</div>
                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 16, lineHeight: 1.6 }}>{doc.desc}</p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  <Btn variant="info" onClick={() => { descargarDocumento(doc.tipo === 'autorizacion' ? generarAutorizacion(p) : generarConsentimiento(p), `${doc.tipo}_${p.nombre.replace(/\s+/g,'_')}.html`); onToast('✓ Descargado — abre el archivo e imprime con Ctrl+P') }}>
                    ⬇ Descargar
                  </Btn>
                  <Btn onClick={() => previsualizarDocumento(doc.tipo === 'autorizacion' ? generarAutorizacion(p) : generarConsentimiento(p))}>
                    👁 Vista previa
                  </Btn>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f9fafb', borderRadius: 8 }}>
                  <input type="checkbox" id={`${doc.tipo}-${p.id}`} checked={p[doc.field]} onChange={e => toggleDoc(doc.field, e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  <label htmlFor={`${doc.tipo}-${p.id}`} style={{ fontSize: 12, color: '#374151', cursor: 'pointer' }}>
                    Marcar como firmado por el/la paciente
                  </label>
                </div>
                <div style={{ marginTop: 10 }}>
                  <Badge variant={p[doc.field] ? 'success' : 'warning'}>{p[doc.field] ? '✓ Firmado' : 'Pendiente de firma'}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        {editMode && (
          <PatientForm initial={selected} patients={patients} title="Editar paciente"
            onSave={saveEdit} onClose={() => setEditMode(false)} />
        )}
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Pacientes" sub={`${patients.length} registrados`} action={<Btn variant="primary" onClick={() => setShowForm(true)}>+ Nuevo paciente</Btn>} />
      <input
        placeholder="🔍 Buscar por nombre o DNI…"
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 9, fontSize: 13, marginBottom: 16, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' }}
      />
      <Card noPad>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
              {['Paciente','DNI','Diagnóstico','Sesiones','Saldo','Estado','Docs'].map(h => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} onClick={() => { setSelected(p); setTab('info') }} style={{ cursor: 'pointer', borderBottom: '1px solid #f9fafb' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={p.nombre} size={34} />
                    <div>
                      <div style={{ fontWeight: 500, color: '#111827' }}>{p.nombre}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '13px 16px', color: '#6b7280' }}>{p.dni}</td>
                <td style={{ padding: '13px 16px', color: '#6b7280', maxWidth: 180, fontSize: 12 }}>{p.diagnosis?.split(' - ')[0] || '—'}</td>
                <td style={{ padding: '13px 16px', fontWeight: 500 }}>{p.sessions}</td>
                <td style={{ padding: '13px 16px', fontWeight: 600, color: p.balance < 0 ? '#dc2626' : '#16a34a' }}>{p.balance}€</td>
                <td style={{ padding: '13px 16px' }}><Badge variant={p.status === 'activo' ? 'success' : 'warning'}>{p.status}</Badge></td>
                <td style={{ padding: '13px 16px' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Badge variant={p.autorizacion ? 'success' : 'danger'}>{p.autorizacion ? '✓ RGPD' : '✗ RGPD'}</Badge>
                    <Badge variant={p.consentimiento ? 'success' : 'danger'}>{p.consentimiento ? '✓ CI' : '✗ CI'}</Badge>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <p style={{ textAlign: 'center', color: '#9ca3af', padding: 40, fontSize: 13 }}>Sin resultados</p>}
      </Card>

      {showForm && <PatientForm initial={BLANK} patients={patients} title="Nuevo paciente" onSave={saveNew} onClose={() => setShowForm(false)} />}
    </div>
  )
}
