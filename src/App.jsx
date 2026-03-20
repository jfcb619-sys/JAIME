import React, { useState, useEffect } from 'react'
import { DSM5 } from './data/dsm5.js'
import { generarAutorizacionHTML, generarConsentimientoHTML, descargarDoc } from './utils/documents.js'
import { saveData, loadData, saveSession, loadSession, clearSession } from './utils/storage.js'

const VALID_USER = 'jaime'
const VALID_PASS = 'PsicoJaime2025!'

const tom = () => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0] }
const DEMO_PATIENTS = [
  { id:1, nombre:'Ana García López', dni:'12345678A', fechaNacimiento:'1990-05-12', sexo:'Mujer', telefono:'612 345 678', email:'ana@email.com', direccion:'Calle Mayor 14, 2ºB, Madrid', ocupacion:'Enfermera', estadoCivil:'Soltera', contactoEmergencia:'María López – 611 222 333', motivoConsulta:'Ansiedad generalizada y dificultad para dormir', antecedentesFamiliares:'Madre con depresión', antecedentesPersonales:'Ninguno relevante', medicacion:'Ninguna', modalidad:'Online', idiomasSesion:'Español', diagnosis:'F41.1 - Trastorno de ansiedad generalizada (TAG)', since:'2024-03-15', sessions:12, status:'activo', balance:0, notes:[], autorizacion:false, consentimiento:false },
  { id:2, nombre:'Carlos Mendez Ruiz', dni:'87654321B', fechaNacimiento:'1996-11-03', sexo:'Hombre', telefono:'698 765 432', email:'carlos@email.com', direccion:'Av. de la Paz 7, Valencia', ocupacion:'Diseñador gráfico', estadoCivil:'Soltero', contactoEmergencia:'Luis Mendez – 699 888 777', motivoConsulta:'Estado de ánimo bajo, falta de motivación', antecedentesFamiliares:'Ninguno', antecedentesPersonales:'Episodio depresivo leve hace 3 años', medicacion:'Sertralina 50mg', modalidad:'Online', idiomasSesion:'Español', diagnosis:'F32.1 - Episodio depresivo mayor moderado', since:'2024-06-01', sessions:8, status:'activo', balance:-80, notes:[], autorizacion:false, consentimiento:false },
]
const DEMO_INVOICES = [
  { id:1, patientId:1, patient:'Ana García López', concept:'Sesión individual', date:'2025-03-10', amount:80, status:'pagada', method:'transferencia' },
  { id:2, patientId:2, patient:'Carlos Mendez Ruiz', concept:'Sesión individual', date:'2025-03-12', amount:80, status:'pendiente', method:'' },
]
const DEMO_APPOINTMENTS = [
  { id:1, patientId:1, patient:'Ana García López', date:tom(), time:'10:00', duration:50, type:'individual' },
  { id:2, patientId:2, patient:'Carlos Mendez Ruiz', date:tom(), time:'11:00', duration:50, type:'individual' },
]

// ── UI helpers ──
const cs = {
  card: { background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:20 },
  inp: { width:'100%', padding:'8px 12px', border:'1px solid #d1d5db', borderRadius:8, fontSize:13, fontFamily:'inherit', boxSizing:'border-box', outline:'none', color:'#111827', background:'#fff' },
  lbl: { display:'block', fontSize:11, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600, marginBottom:5 },
}
function Btn({children,variant='default',onClick,disabled,size='md',style:sx={}}) {
  const v={default:{bg:'#fff',br:'#d1d5db',co:'#374151'},primary:{bg:'#1d4ed8',br:'#1d4ed8',co:'#fff'},success:{bg:'#dcfce7',br:'#86efac',co:'#166534'},danger:{bg:'#fee2e2',br:'#fca5a5',co:'#991b1b'},warning:{bg:'#fef9c3',br:'#fde047',co:'#854d0e'},info:{bg:'#dbeafe',br:'#93c5fd',co:'#1e40af'},ghost:{bg:'transparent',br:'#e5e7eb',co:'#6b7280'}}[variant]
  const p={sm:'5px 12px',md:'8px 16px',lg:'11px 24px'}[size]
  return <button onClick={onClick} disabled={disabled} style={{background:v.bg,border:`1px solid ${v.br}`,color:v.co,padding:p,borderRadius:8,fontSize:size==='sm'?12:13,fontWeight:500,cursor:disabled?'not-allowed':'pointer',display:'inline-flex',alignItems:'center',gap:6,opacity:disabled?0.6:1,fontFamily:'inherit',...sx}}>{children}</button>
}
function Badge({children,variant='default'}) {
  const v={default:['#f3f4f6','#374151'],success:['#dcfce7','#166534'],danger:['#fee2e2','#991b1b'],warning:['#fef9c3','#854d0e'],info:['#dbeafe','#1e40af'],purple:['#ede9fe','#6b21a8']}[variant]||['#f3f4f6','#374151']
  return <span style={{background:v[0],color:v[1],padding:'2px 9px',borderRadius:20,fontSize:11,fontWeight:500,whiteSpace:'nowrap'}}>{children}</span>
}
function Field({label,children}) { return <div style={{marginBottom:14}}><label style={cs.lbl}>{label}</label>{children}</div> }
function Inp({label,...p}) { return <Field label={label}><input style={cs.inp} {...p}/></Field> }
function Sel({label,children,...p}) { return <Field label={label}><select style={cs.inp} {...p}>{children}</select></Field> }
function Txta({label,...p}) { return <Field label={label}><textarea style={{...cs.inp,resize:'vertical',minHeight:80}} {...p}/></Field> }
function Modal({title,onClose,children,footer}) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
      <div style={{background:'#fff',borderRadius:14,width:'100%',maxWidth:640,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 22px',borderBottom:'1px solid #f3f4f6'}}>
          <span style={{fontSize:16,fontWeight:600}}>{title}</span>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:22,cursor:'pointer',color:'#9ca3af'}}>×</button>
        </div>
        <div style={{padding:22}}>{children}</div>
        {footer&&<div style={{padding:'14px 22px',borderTop:'1px solid #f3f4f6',display:'flex',justifyContent:'flex-end',gap:10}}>{footer}</div>}
      </div>
    </div>
  )
}
function Avatar({name,size=36}) {
  const cols=[['#dbeafe','#1e40af'],['#dcfce7','#166534'],['#ede9fe','#6b21a8'],['#fef9c3','#854d0e'],['#fee2e2','#991b1b']]
  const [bg,fg]=cols[name.charCodeAt(0)%cols.length]
  return <div style={{width:size,height:size,borderRadius:'50%',background:bg,color:fg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.38,fontWeight:700,flexShrink:0}}>{name[0]}</div>
}
function Toast({msg}) { return msg?<div style={{position:'fixed',bottom:28,right:28,zIndex:9999,background:'#111827',color:'#fff',padding:'12px 20px',borderRadius:10,fontSize:13,fontWeight:500,boxShadow:'0 8px 24px rgba(0,0,0,0.2)'}}>{msg}</div>:null }
function SecTitle({children}) { return <div style={{fontSize:11,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.07em',fontWeight:600,borderBottom:'1px solid #f3f4f6',paddingBottom:7,marginBottom:14,marginTop:20}}>{children}</div> }
function G2({children,gap=14,cols=2}) { return <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap}}>{children}</div> }
function ICell({label,value,full}) {
  return <div style={{background:'#f9fafb',borderRadius:8,padding:'10px 14px',gridColumn:full?'1 / -1':'auto'}}>
    <div style={{fontSize:10,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>{label}</div>
    <div style={{fontSize:13,color:'#111827'}}>{value||'—'}</div>
  </div>
}

// ── LOGIN ──
function Login({onLogin}) {
  const [user,setUser]=useState(''); const [pass,setPass]=useState(''); const [err,setErr]=useState(''); const [show,setShow]=useState(false)
  function submit(e) {
    e.preventDefault()
    if(user.trim()===VALID_USER&&pass===VALID_PASS){saveSession(user);onLogin(user)}
    else{setErr('Usuario o contraseña incorrectos');setPass('')}
  }
  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#1e3a6e 0%,#1d4ed8 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'#fff',borderRadius:18,padding:'44px 40px',width:'100%',maxWidth:400,boxShadow:'0 24px 60px rgba(0,0,0,0.25)'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontSize:38,marginBottom:8}}>🧠</div>
          <h1 style={{fontSize:24,fontWeight:700,color:'#111827',marginBottom:4}}>PsicoJaime</h1>
          <p style={{fontSize:13,color:'#6b7280'}}>Consulta de Psicología Online · Acceso privado</p>
        </div>
        <form onSubmit={submit}>
          <Field label="Usuario"><input style={cs.inp} value={user} onChange={e=>{setUser(e.target.value);setErr('')}} autoComplete="username" placeholder="tu usuario"/></Field>
          <Field label="Contraseña">
            <div style={{position:'relative'}}>
              <input style={{...cs.inp,paddingRight:40}} type={show?'text':'password'} value={pass} onChange={e=>{setPass(e.target.value);setErr('')}} autoComplete="current-password" placeholder="tu contraseña"/>
              <button type="button" onClick={()=>setShow(s=>!s)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:16,color:'#9ca3af'}}>{show?'🙈':'👁'}</button>
            </div>
          </Field>
          {err&&<div style={{background:'#fee2e2',color:'#991b1b',padding:'9px 14px',borderRadius:8,fontSize:13,marginBottom:14}}>⚠️ {err}</div>}
          <Btn variant="primary" size="lg" style={{width:'100%',justifyContent:'center'}}>Iniciar sesión →</Btn>
        </form>
        <p style={{fontSize:11,color:'#9ca3af',textAlign:'center',marginTop:20,lineHeight:1.6}}>Acceso restringido conforme al RGPD y LOPDGDD.<br/>Los datos clínicos son estrictamente confidenciales.</p>
      </div>
    </div>
  )
}

// ── DASHBOARD ──
function Dashboard({patients,invoices,appointments,onNav}) {
  const today=new Date().toISOString().split('T')[0]; const month=new Date().toISOString().slice(0,7)
  const mInv=invoices.filter(i=>i.date.startsWith(month)); const mRev=mInv.filter(i=>i.status==='pagada').reduce((s,i)=>s+i.amount,0)
  const pend=invoices.filter(i=>i.status==='pendiente').reduce((s,i)=>s+i.amount,0)
  const todayApts=appointments.filter(a=>a.date===today)
  const nextApts=appointments.filter(a=>a.date>=today).sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).slice(0,5)
  const sinDocs=patients.filter(p=>!p.autorizacion||!p.consentimiento)
  const months=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  const now=new Date()
  const barData=Array.from({length:6},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-5+i,1);const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;return{label:months[d.getMonth()],val:invoices.filter(x=>x.date.startsWith(k)&&x.status==='pagada').reduce((s,x)=>s+x.amount,0)}})
  const maxBar=Math.max(...barData.map(b=>b.val),1)
  const fmtD=d=>new Date(d+'T00:00:00').toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'})
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:700,marginBottom:4}}>Buenos días, Jaime 👋</h2>
      <p style={{fontSize:13,color:'#6b7280',marginBottom:24}}>{new Date().toLocaleDateString('es-ES',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      {sinDocs.length>0&&<div style={{background:'#fef9c3',border:'1px solid #fde047',borderRadius:10,padding:'12px 18px',marginBottom:20,display:'flex',alignItems:'center',gap:12}}>
        <span>⚠️</span><span style={{fontSize:13,color:'#854d0e',flex:1}}><strong>{sinDocs.length} paciente{sinDocs.length>1?'s':''} sin documentación completa:</strong> {sinDocs.map(p=>p.nombre.split(' ')[0]).join(', ')}</span>
        <button onClick={()=>onNav('pacientes')} style={{fontSize:12,color:'#854d0e',background:'none',border:'1px solid #fde047',borderRadius:6,padding:'4px 12px',cursor:'pointer'}}>Ver →</button>
      </div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>
        {[{label:'Ingresos del mes',val:`${mRev}€`,sub:`${mInv.length} sesiones`,col:'#1d4ed8'},{label:'Cobros pendientes',val:`${pend}€`,sub:`${invoices.filter(i=>i.status==='pendiente').length} facturas`,col:'#b45309'},{label:'Pacientes activos',val:patients.filter(p=>p.status==='activo').length,sub:`${patients.length} en total`,col:'#166534'},{label:'Citas hoy',val:todayApts.length,sub:todayApts[0]?`Primera: ${todayApts[0].time}h`:'Sin citas hoy',col:'#7c3aed'}].map(({label,val,sub,col})=>(
          <div key={label} style={{...cs.card,padding:'18px 20px'}}>
            <div style={{fontSize:11,color:'#6b7280',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:8}}>{label}</div>
            <div style={{fontSize:26,fontWeight:700,color:col}}>{val}</div>
            <div style={{fontSize:12,color:'#9ca3af',marginTop:4}}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
        <div style={cs.card}>
          <div style={{fontWeight:600,fontSize:14,marginBottom:18}}>Ingresos últimos 6 meses</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:10,height:110}}>
            {barData.map((b,i)=>(
              <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
                <div style={{fontSize:10,color:'#9ca3af'}}>{b.val?`${b.val}€`:''}</div>
                <div style={{width:'100%',height:`${Math.max(Math.round((b.val/maxBar)*90),b.val?4:0)}px`,background:i===5?'#1d4ed8':'#dbeafe',borderRadius:'4px 4px 0 0'}}/>
                <div style={{fontSize:11,color:'#6b7280'}}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={cs.card}>
          <div style={{fontWeight:600,fontSize:14,marginBottom:14}}>Próximas citas</div>
          {nextApts.length?nextApts.map((a,i)=>(
            <div key={a.id} style={{display:'flex',alignItems:'center',gap:12,padding:'9px 0',borderBottom:i<nextApts.length-1?'1px solid #f3f4f6':'none'}}>
              <Avatar name={a.patient} size={32}/>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{a.patient}</div><div style={{fontSize:11,color:'#9ca3af'}}>{fmtD(a.date)} · {a.time}h</div></div>
              <Badge variant="info">{a.duration}min</Badge>
            </div>
          )):<p style={{fontSize:13,color:'#9ca3af'}}>Sin citas próximas</p>}
        </div>
      </div>
    </div>
  )
}

// ── PATIENT FORM MODAL ──
function PatientForm({initial,onSave,onCancel}) {
  const emp={nombre:'',dni:'',fechaNacimiento:'',sexo:'Mujer',telefono:'',email:'',direccion:'',ocupacion:'',estadoCivil:'Soltero/a',contactoEmergencia:'',motivoConsulta:'',antecedentesFamiliares:'',antecedentesPersonales:'',medicacion:'Ninguna',modalidad:'Online',idiomasSesion:'Español',diagnosis:'',since:new Date().toISOString().split('T')[0],status:'activo'}
  const [f,setF]=useState(initial||emp)
  const u=k=>e=>setF(p=>({...p,[k]:e.target.value}))
  return (
    <Modal title={initial?'Editar paciente':'Nuevo paciente'} onClose={onCancel} footer={<><Btn variant="ghost" onClick={onCancel}>Cancelar</Btn><Btn variant="primary" onClick={()=>onSave(f)}>Guardar</Btn></>}>
      <SecTitle>Datos identificativos</SecTitle>
      <G2><Inp label="Nombre completo *" value={f.nombre} onChange={u('nombre')}/><Inp label="DNI/NIE *" value={f.dni} onChange={u('dni')}/></G2>
      <G2><Inp label="Fecha de nacimiento" type="date" value={f.fechaNacimiento} onChange={u('fechaNacimiento')}/><Sel label="Sexo" value={f.sexo} onChange={u('sexo')}><option>Mujer</option><option>Hombre</option><option>No binario/a</option><option>Prefiero no indicarlo</option></Sel></G2>
      <G2><Inp label="Teléfono" value={f.telefono} onChange={u('telefono')}/><Inp label="Email" type="email" value={f.email} onChange={u('email')}/></G2>
      <Inp label="Dirección" value={f.direccion} onChange={u('direccion')}/>
      <G2><Inp label="Ocupación" value={f.ocupacion} onChange={u('ocupacion')}/><Sel label="Estado civil" value={f.estadoCivil} onChange={u('estadoCivil')}><option>Soltero/a</option><option>Casado/a</option><option>Pareja de hecho</option><option>Separado/a</option><option>Divorciado/a</option><option>Viudo/a</option></Sel></G2>
      <Inp label="Contacto de emergencia" value={f.contactoEmergencia} onChange={u('contactoEmergencia')} placeholder="Nombre – teléfono"/>
      <SecTitle>Historia clínica</SecTitle>
      <Txta label="Motivo de consulta" value={f.motivoConsulta} onChange={u('motivoConsulta')}/>
      <Sel label="Diagnóstico DSM-5 / CIE-11" value={f.diagnosis} onChange={u('diagnosis')}>
        <option value="">Sin diagnóstico / En evaluación</option>
        {DSM5.map(d=><option key={d} value={d}>{d}</option>)}
      </Sel>
      <G2><Txta label="Antecedentes familiares" value={f.antecedentesFamiliares} onChange={u('antecedentesFamiliares')} style={{minHeight:60}}/><Txta label="Antecedentes personales" value={f.antecedentesPersonales} onChange={u('antecedentesPersonales')} style={{minHeight:60}}/></G2>
      <Inp label="Medicación actual" value={f.medicacion} onChange={u('medicacion')} placeholder="Ninguna / especificar"/>
      <SecTitle>Datos de la consulta</SecTitle>
      <G2><Sel label="Modalidad" value={f.modalidad} onChange={u('modalidad')}><option>Online</option><option>Presencial</option><option>Mixta</option></Sel><Sel label="Estado" value={f.status} onChange={u('status')}><option value="activo">Activo</option><option value="alta">Alta</option><option value="pausado">Pausado</option></Sel></G2>
      <G2><Inp label="En consulta desde" type="date" value={f.since} onChange={u('since')}/><Inp label="Idioma sesiones" value={f.idiomasSesion} onChange={u('idiomasSesion')}/></G2>
    </Modal>
  )
}

// ── PATIENTS ──
function Patients({patients,setPatients,onToast}) {
  const [sel,setSel]=useState(null); const [tab,setTab]=useState('info')
  const [showForm,setShowForm]=useState(false); const [editP,setEditP]=useState(null)
  const [search,setSearch]=useState('')
  const [nf,setNf]=useState({fecha:new Date().toISOString().split('T')[0],evolucion:'estable',objetivos:'',contenido:'',tareas:''})
  const nu=k=>e=>setNf(p=>({...p,[k]:e.target.value}))

  function savePat(f) {
    if(!f.nombre.trim())return
    if(editP){const up=patients.map(p=>p.id===editP.id?{...editP,...f}:p);setPatients(up);if(sel?.id===editP.id)setSel({...editP,...f})}
    else{const np={...f,id:Date.now(),sessions:0,balance:0,notes:[],autorizacion:false,consentimiento:false};setPatients(p=>[...p,np])}
    setShowForm(false);setEditP(null);onToast('✓ Paciente guardado')
  }

  function addNote() {
    if(!nf.contenido.trim()&&!nf.objetivos.trim())return
    const note={...nf,id:Date.now()}
    const up=patients.map(p=>p.id===sel.id?{...p,notes:[...(p.notes||[]),note],sessions:p.sessions+1}:p)
    setPatients(up);setSel(p=>({...p,notes:[...(p.notes||[]),note],sessions:p.sessions+1}))
    setNf({fecha:new Date().toISOString().split('T')[0],evolucion:'estable',objetivos:'',contenido:'',tareas:''});onToast('✓ Nota guardada')
  }

  function toggleDoc(tipo,val) {
    const up=patients.map(p=>p.id===sel.id?{...p,[tipo]:val}:p)
    setPatients(up);setSel(p=>({...p,[tipo]:val}));onToast(`✓ ${tipo==='autorizacion'?'Autorización RGPD':'Consentimiento informado'} ${val?'firmado':'desmarcado'}`)
  }

  function dlDoc(tipo) {
    const html=tipo==='autorizacion'?generarAutorizacionHTML(sel):generarConsentimientoHTML(sel)
    descargarDoc(html,`${tipo}_${sel.nombre.replace(/\s+/g,'_')}.html`);onToast('✓ Descargado — abre en navegador e imprime con Ctrl+P')
  }

  function previewDoc(tipo) {
    const html=tipo==='autorizacion'?generarAutorizacionHTML(sel):generarConsentimientoHTML(sel)
    const w=window.open('','_blank');if(w){w.document.write(html);w.document.close()}
  }

  const evC={mejora:'#16a34a',estable:'#2563eb',empeora:'#dc2626'}
  const evBadge=ev=><Badge variant={ev==='mejora'?'success':ev==='empeora'?'danger':'info'}>{ev==='mejora'?'↑ Mejora':ev==='empeora'?'↓ Empeora':'→ Estable'}</Badge>
  const TABS=[{id:'info',l:'👤 Datos'},{id:'historia',l:'📋 Historia'},{id:'notas',l:'📝 Notas'},{id:'evolucion',l:'📈 Evolución'},{id:'docs',l:'📄 Documentos'}]

  if(sel) {
    const p=sel; const notes=p.notes||[]
    return (
      <div>
        <button onClick={()=>{setSel(null);setTab('info')}} style={{background:'none',border:'none',color:'#6b7280',cursor:'pointer',fontSize:13,marginBottom:18,display:'flex',alignItems:'center',gap:5}}>← Volver</button>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
          <Avatar name={p.nombre} size={50}/>
          <div style={{flex:1}}>
            <h2 style={{fontSize:20,fontWeight:700}}>{p.nombre}</h2>
            <div style={{display:'flex',gap:6,marginTop:5,flexWrap:'wrap'}}>
              <Badge variant={p.status==='activo'?'success':'warning'}>{p.status}</Badge>
              <Badge variant={p.autorizacion?'success':'danger'}>{p.autorizacion?'✓ RGPD':'✗ RGPD'}</Badge>
              <Badge variant={p.consentimiento?'success':'danger'}>{p.consentimiento?'✓ CI':'✗ CI'}</Badge>
            </div>
          </div>
          <div style={{display:'flex',gap:20,textAlign:'center'}}>
            <div><div style={{fontSize:22,fontWeight:700,color:'#1d4ed8'}}>{p.sessions}</div><div style={{fontSize:11,color:'#9ca3af'}}>sesiones</div></div>
            <div><div style={{fontSize:22,fontWeight:700,color:p.balance<0?'#dc2626':'#16a34a'}}>{p.balance}€</div><div style={{fontSize:11,color:'#9ca3af'}}>saldo</div></div>
          </div>
          <Btn onClick={()=>{setEditP(p);setShowForm(true)}}>✏️ Editar</Btn>
        </div>
        <div style={{display:'flex',gap:2,background:'#f3f4f6',padding:3,borderRadius:10,marginBottom:22,width:'fit-content'}}>
          {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'7px 14px',borderRadius:8,border:'none',background:tab===t.id?'#fff':'transparent',color:tab===t.id?'#111827':'#6b7280',fontWeight:tab===t.id?600:400,cursor:'pointer',fontSize:12,fontFamily:'inherit',boxShadow:tab===t.id?'0 1px 3px rgba(0,0,0,0.1)':'none'}}>{t.l}</button>)}
        </div>

        {tab==='info'&&<div style={cs.card}>
          <SecTitle>Datos identificativos</SecTitle>
          <G2><ICell label="Nombre" value={p.nombre}/><ICell label="DNI/NIE" value={p.dni}/><ICell label="Fecha nacimiento" value={p.fechaNacimiento}/><ICell label="Sexo" value={p.sexo}/><ICell label="Teléfono" value={p.telefono}/><ICell label="Email" value={p.email}/><ICell label="Estado civil" value={p.estadoCivil}/><ICell label="Ocupación" value={p.ocupacion}/><ICell label="Dirección" value={p.direccion} full/><ICell label="Contacto emergencia" value={p.contactoEmergencia} full/></G2>
          <SecTitle>Consulta</SecTitle>
          <G2><ICell label="Modalidad" value={p.modalidad}/><ICell label="Idioma" value={p.idiomasSesion}/><ICell label="Desde" value={p.since}/><ICell label="Sesiones" value={p.sessions}/><ICell label="Diagnóstico DSM-5/CIE-11" value={p.diagnosis} full/></G2>
        </div>}

        {tab==='historia'&&<div style={cs.card}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><div style={{fontWeight:600,fontSize:15}}>Historia Clínica</div><Btn size="sm" onClick={()=>{setEditP(p);setShowForm(true)}}>✏️ Editar</Btn></div>
          {[['Motivo de consulta',p.motivoConsulta],['Antecedentes familiares',p.antecedentesFamiliares],['Antecedentes personales',p.antecedentesPersonales],['Medicación actual',p.medicacion],['Diagnóstico DSM-5 / CIE-11',p.diagnosis]].map(([k,v])=>(
            <div key={k}><SecTitle>{k}</SecTitle><p style={{fontSize:13,color:'#374151',lineHeight:1.7}}>{v||<em style={{color:'#9ca3af'}}>No registrado</em>}</p></div>
          ))}
        </div>}

        {tab==='notas'&&<div>
          <div style={{...cs.card,marginBottom:14}}>
            <div style={{fontWeight:600,fontSize:14,marginBottom:14}}>Nueva nota de sesión</div>
            <G2><Inp label="Fecha" type="date" value={nf.fecha} onChange={nu('fecha')}/><Sel label="Evolución" value={nf.evolucion} onChange={nu('evolucion')}><option value="mejora">↑ Mejora</option><option value="estable">→ Estable</option><option value="empeora">↓ Empeora</option></Sel></G2>
            <Inp label="Objetivos / temas trabajados" value={nf.objetivos} onChange={nu('objetivos')} placeholder="Reestructuración cognitiva, regulación emocional…"/>
            <Txta label="Contenido de la sesión" value={nf.contenido} onChange={nu('contenido')} placeholder="Observaciones, intervenciones, dinámicas…" style={{minHeight:100}}/>
            <Inp label="Tareas para casa" value={nf.tareas} onChange={nu('tareas')} placeholder="Ejercicio de respiración, registro de pensamientos…"/>
            <Btn variant="primary" onClick={addNote}>+ Guardar nota</Btn>
          </div>
          {notes.length===0&&<p style={{textAlign:'center',color:'#9ca3af',padding:30,fontSize:13}}>Sin notas aún</p>}
          {notes.slice().reverse().map((n,i)=>(
            <div key={i} style={{...cs.card,marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:12,color:'#6b7280'}}>{n.fecha}</span>{evBadge(n.evolucion)}</div>
              {n.objetivos&&<div style={{fontSize:11,color:'#9ca3af',marginBottom:6}}>🎯 {n.objetivos}</div>}
              <p style={{fontSize:13,color:'#374151',lineHeight:1.6,marginBottom:n.tareas?8:0}}>{n.contenido||'—'}</p>
              {n.tareas&&<div style={{fontSize:12,background:'#f0fdf4',padding:'6px 12px',borderRadius:7,color:'#374151'}}>📋 Tareas: {n.tareas}</div>}
            </div>
          ))}
        </div>}

        {tab==='evolucion'&&<div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:14}}>
            {[['↑ Mejora','success',notes.filter(n=>n.evolucion==='mejora').length],['→ Estable','info',notes.filter(n=>n.evolucion==='estable').length],['↓ Empeora','danger',notes.filter(n=>n.evolucion==='empeora').length]].map(([label,v,count])=>(
              <div key={label} style={{...cs.card,textAlign:'center'}}><div style={{fontSize:11,color:'#6b7280',marginBottom:6}}>{label}</div><div style={{fontSize:28,fontWeight:700}}>{count}</div></div>
            ))}
          </div>
          <div style={cs.card}>
            <div style={{fontWeight:600,fontSize:14,marginBottom:16}}>Línea de evolución</div>
            {notes.length===0?<p style={{textAlign:'center',color:'#9ca3af',fontSize:13}}>Sin datos</p>:notes.map((n,i)=>(
              <div key={i} style={{display:'flex',gap:14,marginBottom:14}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                  <div style={{width:10,height:10,borderRadius:'50%',background:evC[n.evolucion],flexShrink:0,marginTop:3}}/>
                  {i<notes.length-1&&<div style={{width:2,flex:1,background:'#f3f4f6',minHeight:20}}/>}
                </div>
                <div style={{paddingBottom:8}}>
                  <div style={{fontSize:11,color:'#9ca3af'}}>{n.fecha}</div>
                  <div style={{fontSize:13,color:'#374151',marginTop:2}}>{n.contenido?.slice(0,100)}{n.contenido?.length>100?'…':''}</div>
                  <div style={{marginTop:3}}>{evBadge(n.evolucion)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>}

        {tab==='docs'&&<G2>
          {[{tipo:'autorizacion',title:'Autorización de datos (RGPD)',desc:'Documento de autorización para el tratamiento de datos personales conforme al RGPD y LOPDGDD. Descarga, imprime y obtén la firma del paciente.',flag:'autorizacion'},{tipo:'consentimiento',title:'Consentimiento Informado',desc:'Documento de consentimiento para el tratamiento psicológico. Incluye proceso terapéutico, confidencialidad, honorarios y derechos del paciente.',flag:'consentimiento'}].map(({tipo,title,desc,flag})=>(
            <div key={tipo} style={cs.card}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:6}}>{title}</div>
              <p style={{fontSize:12,color:'#6b7280',marginBottom:14,lineHeight:1.6}}>{desc}</p>
              <div style={{display:'flex',gap:8,marginBottom:14}}>
                <Btn variant="info" size="sm" onClick={()=>dlDoc(tipo)}>⬇ Descargar</Btn>
                <Btn size="sm" onClick={()=>previewDoc(tipo)}>👁 Vista previa</Btn>
              </div>
              <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
                <input type="checkbox" checked={p[flag]} onChange={e=>toggleDoc(flag,e.target.checked)}/>
                <span style={{fontSize:12,color:'#6b7280'}}>Marcar como firmado</span>
              </label>
              <div style={{marginTop:8}}><Badge variant={p[flag]?'success':'warning'}>{p[flag]?'✓ Firmado':'Pendiente de firma'}</Badge></div>
            </div>
          ))}
        </G2>}
        {showForm&&<PatientForm initial={editP} onSave={savePat} onCancel={()=>{setShowForm(false);setEditP(null)}}/>}
      </div>
    )
  }

  const filtered=patients.filter(p=>p.nombre.toLowerCase().includes(search.toLowerCase())||p.dni.includes(search))
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div><h2 style={{fontSize:22,fontWeight:700}}>Pacientes</h2><p style={{fontSize:13,color:'#6b7280'}}>{patients.length} registrados</p></div>
        <Btn variant="primary" onClick={()=>{setEditP(null);setShowForm(true)}}>+ Nuevo paciente</Btn>
      </div>
      <input placeholder="Buscar por nombre o DNI…" value={search} onChange={e=>setSearch(e.target.value)} style={{...cs.inp,marginBottom:16}}/>
      <div style={{...cs.card,padding:0,overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead><tr style={{borderBottom:'1px solid #f3f4f6'}}>{['Paciente','DNI','Diagnóstico','Sesiones','Saldo','Estado','Docs'].map(h=><th key={h} style={{padding:'11px 16px',textAlign:'left',fontSize:11,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',fontWeight:600}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(p=>(
              <tr key={p.id} onClick={()=>setSel(p)} style={{cursor:'pointer',borderBottom:'1px solid #f9fafb'}} onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{padding:'13px 16px'}}><div style={{display:'flex',alignItems:'center',gap:10}}><Avatar name={p.nombre} size={34}/><div><div style={{fontWeight:500}}>{p.nombre}</div><div style={{fontSize:11,color:'#9ca3af'}}>{p.email}</div></div></div></td>
                <td style={{padding:'13px 16px',color:'#6b7280'}}>{p.dni}</td>
                <td style={{padding:'13px 16px',color:'#6b7280',fontSize:12,maxWidth:180}}>{p.diagnosis||'—'}</td>
                <td style={{padding:'13px 16px'}}>{p.sessions}</td>
                <td style={{padding:'13px 16px',fontWeight:600,color:p.balance<0?'#dc2626':'#16a34a'}}>{p.balance}€</td>
                <td style={{padding:'13px 16px'}}><Badge variant={p.status==='activo'?'success':'warning'}>{p.status}</Badge></td>
                <td style={{padding:'13px 16px'}}><div style={{display:'flex',gap:4,flexWrap:'wrap'}}><Badge variant={p.autorizacion?'success':'danger'}>{p.autorizacion?'✓':'✗'} RGPD</Badge><Badge variant={p.consentimiento?'success':'danger'}>{p.consentimiento?'✓':'✗'} CI</Badge></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<p style={{textAlign:'center',color:'#9ca3af',padding:40,fontSize:14}}>Sin pacientes</p>}
      </div>
      {showForm&&<PatientForm initial={editP} onSave={savePat} onCancel={()=>{setShowForm(false);setEditP(null)}}/>}
    </div>
  )
}

// ── AGENDA ──
function Agenda({appointments,setAppointments,patients,onToast}) {
  const [showNew,setShowNew]=useState(false)
  const [f,setF]=useState({patientId:'',date:new Date().toISOString().split('T')[0],time:'10:00',duration:'50',type:'individual'})
  const u=k=>e=>setF(p=>({...p,[k]:e.target.value}))
  const hours=['08:00','09:00','10:00','11:00','12:00','13:00','16:00','17:00','18:00','19:00','20:00']
  function addAppt(){const p=patients.find(x=>x.id===Number(f.patientId));if(!p||!f.date)return;setAppointments(a=>[...a,{...f,id:Date.now(),patient:p.nombre,patientId:Number(f.patientId),duration:Number(f.duration)}]);setShowNew(false);onToast('✓ Cita añadida')}
  const sorted=[...appointments].sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time))
  const grouped=sorted.reduce((acc,a)=>{(acc[a.date]=acc[a.date]||[]).push(a);return acc},{})
  const fmtD=d=>new Date(d+'T00:00:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div><h2 style={{fontSize:22,fontWeight:700}}>Agenda</h2><p style={{fontSize:13,color:'#6b7280'}}>{appointments.length} citas</p></div>
        <Btn variant="primary" onClick={()=>setShowNew(true)}>+ Nueva cita</Btn>
      </div>
      {Object.keys(grouped).length===0&&<p style={{textAlign:'center',color:'#9ca3af',padding:40}}>Sin citas registradas</p>}
      {Object.keys(grouped).map(date=>(
        <div key={date} style={{marginBottom:22}}>
          <div style={{fontSize:12,fontWeight:600,color:'#1d4ed8',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>{fmtD(date)}</div>
          <div style={{...cs.card,padding:0}}>
            {grouped[date].map((a,i)=>(
              <div key={a.id} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 18px',borderBottom:i<grouped[date].length-1?'1px solid #f3f4f6':'none'}}>
                <div style={{fontSize:20,fontWeight:700,color:'#1d4ed8',minWidth:52}}>{a.time}</div>
                <Avatar name={a.patient} size={32}/>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{a.patient}</div><div style={{fontSize:11,color:'#9ca3af'}}>{a.type} · {a.duration} min</div></div>
                <button onClick={()=>setAppointments(ap=>ap.filter(x=>x.id!==a.id))} style={{background:'#fee2e2',border:'none',borderRadius:6,padding:'4px 10px',cursor:'pointer',color:'#991b1b',fontSize:12}}>✕</button>
              </div>
            ))}
          </div>
        </div>
      ))}
      {showNew&&<Modal title="Nueva cita" onClose={()=>setShowNew(false)} footer={<><Btn variant="ghost" onClick={()=>setShowNew(false)}>Cancelar</Btn><Btn variant="primary" onClick={addAppt}>Guardar</Btn></>}>
        <Sel label="Paciente" value={f.patientId} onChange={u('patientId')}><option value="">Seleccionar…</option>{patients.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}</Sel>
        <G2><Inp label="Fecha" type="date" value={f.date} onChange={u('date')}/><Sel label="Hora" value={f.time} onChange={u('time')}>{hours.map(h=><option key={h} value={h}>{h}</option>)}</Sel></G2>
        <G2><Inp label="Duración (min)" type="number" value={f.duration} onChange={u('duration')}/><Sel label="Tipo" value={f.type} onChange={u('type')}><option value="individual">Individual</option><option value="pareja">Pareja</option><option value="familia">Familia</option><option value="grupo">Grupo</option></Sel></G2>
      </Modal>}
    </div>
  )
}

// ── FACTURACIÓN ──
function Facturacion({invoices,setInvoices,patients,onToast}) {
  const [filter,setFilter]=useState('todas'); const [showNew,setShowNew]=useState(false)
  const [f,setF]=useState({patientId:'',concept:'Sesión individual',date:new Date().toISOString().split('T')[0],amount:'80',method:'transferencia'})
  const u=k=>e=>setF(p=>({...p,[k]:e.target.value}))
  function addInv(){const p=patients.find(x=>x.id===Number(f.patientId));if(!p)return;setInvoices(inv=>[...inv,{...f,id:Date.now(),patient:p.nombre,patientId:Number(f.patientId),status:'pendiente',amount:Number(f.amount)}]);setShowNew(false);onToast('✓ Factura creada')}
  function markPaid(id){setInvoices(inv=>inv.map(i=>i.id===id?{...i,status:'pagada'}:i));onToast('✓ Marcada como pagada')}
  const filtered=filter==='todas'?invoices:invoices.filter(i=>i.status===filter)
  const pagadas=invoices.filter(i=>i.status==='pagada').reduce((s,i)=>s+i.amount,0)
  const pend=invoices.filter(i=>i.status==='pendiente').reduce((s,i)=>s+i.amount,0)
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div><h2 style={{fontSize:22,fontWeight:700}}>Facturación</h2><p style={{fontSize:13,color:'#6b7280'}}>{invoices.length} facturas</p></div>
        <Btn variant="primary" onClick={()=>setShowNew(true)}>+ Nueva factura</Btn>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:18}}>
        <div style={{...cs.card,padding:'18px 20px'}}><div style={{fontSize:11,color:'#6b7280',fontWeight:600,textTransform:'uppercase',marginBottom:6}}>Total cobrado</div><div style={{fontSize:24,fontWeight:700,color:'#16a34a'}}>{pagadas}€</div></div>
        <div style={{...cs.card,padding:'18px 20px'}}><div style={{fontSize:11,color:'#6b7280',fontWeight:600,textTransform:'uppercase',marginBottom:6}}>Pendiente</div><div style={{fontSize:24,fontWeight:700,color:'#b45309'}}>{pend}€</div></div>
        <div style={{...cs.card,padding:'18px 20px'}}><div style={{fontSize:11,color:'#6b7280',fontWeight:600,textTransform:'uppercase',marginBottom:6}}>Total facturado</div><div style={{fontSize:24,fontWeight:700}}>{pagadas+pend}€</div></div>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        {['todas','pendiente','pagada'].map(fi=><button key={fi} onClick={()=>setFilter(fi)} style={{padding:'6px 16px',borderRadius:20,border:'none',background:filter===fi?'#1d4ed8':'#e5e7eb',color:filter===fi?'#fff':'#374151',cursor:'pointer',fontSize:13,fontFamily:'inherit',textTransform:'capitalize'}}>{fi}</button>)}
      </div>
      <div style={{...cs.card,padding:0,overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead><tr style={{borderBottom:'1px solid #f3f4f6'}}>{['Paciente','Concepto','Fecha','Importe','Método','Estado',''].map(h=><th key={h} style={{padding:'11px 16px',textAlign:'left',fontSize:11,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',fontWeight:600}}>{h}</th>)}</tr></thead>
          <tbody>
            {[...filtered].sort((a,b)=>b.date.localeCompare(a.date)).map(inv=>(
              <tr key={inv.id} style={{borderBottom:'1px solid #f9fafb'}}>
                <td style={{padding:'12px 16px',fontWeight:500}}>{inv.patient}</td>
                <td style={{padding:'12px 16px',color:'#6b7280'}}>{inv.concept}</td>
                <td style={{padding:'12px 16px',color:'#6b7280'}}>{inv.date}</td>
                <td style={{padding:'12px 16px',fontWeight:600}}>{inv.amount}€</td>
                <td style={{padding:'12px 16px',color:'#6b7280',textTransform:'capitalize'}}>{inv.method||'—'}</td>
                <td style={{padding:'12px 16px'}}><Badge variant={inv.status==='pagada'?'success':'warning'}>{inv.status}</Badge></td>
                <td style={{padding:'12px 16px'}}>{inv.status==='pendiente'&&<Btn size="sm" variant="success" onClick={()=>markPaid(inv.id)}>✓ Cobrar</Btn>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<p style={{textAlign:'center',color:'#9ca3af',padding:30}}>Sin facturas</p>}
      </div>
      {showNew&&<Modal title="Nueva factura" onClose={()=>setShowNew(false)} footer={<><Btn variant="ghost" onClick={()=>setShowNew(false)}>Cancelar</Btn><Btn variant="primary" onClick={addInv}>Crear</Btn></>}>
        <Sel label="Paciente" value={f.patientId} onChange={u('patientId')}><option value="">Seleccionar…</option>{patients.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}</Sel>
        <Inp label="Concepto" value={f.concept} onChange={u('concept')}/>
        <G2><Inp label="Fecha" type="date" value={f.date} onChange={u('date')}/><Inp label="Importe (€)" type="number" value={f.amount} onChange={u('amount')}/></G2>
        <Sel label="Método de pago" value={f.method} onChange={u('method')}><option value="efectivo">Efectivo</option><option value="transferencia">Transferencia</option><option value="bizum">Bizum</option><option value="tarjeta">Tarjeta</option></Sel>
      </Modal>}
    </div>
  )
}

// ── FINANZAS ──
function Finanzas({invoices}) {
  const months=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']; const now=new Date()
  const data=Array.from({length:6},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-5+i,1);const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;const paid=invoices.filter(x=>x.date.startsWith(k)&&x.status==='pagada').reduce((s,x)=>s+x.amount,0);const pend=invoices.filter(x=>x.date.startsWith(k)&&x.status==='pendiente').reduce((s,x)=>s+x.amount,0);return{label:months[d.getMonth()],paid,pend,total:paid+pend}})
  const maxV=Math.max(...data.map(d=>d.total),1)
  const yearTotal=invoices.filter(i=>i.date.startsWith(String(now.getFullYear()))&&i.status==='pagada').reduce((s,i)=>s+i.amount,0)
  const methods=invoices.filter(i=>i.status==='pagada').reduce((acc,i)=>{acc[i.method||'efectivo']=(acc[i.method||'efectivo']||0)+i.amount;return acc},{})
  const mt=Object.values(methods).reduce((s,v)=>s+v,0)
  const mc={transferencia:'#1d4ed8',bizum:'#7c3aed',efectivo:'#16a34a',tarjeta:'#b45309'}
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:700,marginBottom:4}}>Finanzas y Reportes</h2>
      <p style={{fontSize:13,color:'#6b7280',marginBottom:24}}>Resumen económico de la consulta</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
        <div style={{...cs.card,padding:'18px 20px'}}><div style={{fontSize:11,color:'#6b7280',fontWeight:600,textTransform:'uppercase',marginBottom:6}}>Facturado este año</div><div style={{fontSize:24,fontWeight:700,color:'#1d4ed8'}}>{yearTotal}€</div></div>
        <div style={{...cs.card,padding:'18px 20px'}}><div style={{fontSize:11,color:'#6b7280',fontWeight:600,textTransform:'uppercase',marginBottom:6}}>Mes actual</div><div style={{fontSize:24,fontWeight:700,color:'#16a34a'}}>{data[5].paid}€</div></div>
        <div style={{...cs.card,padding:'18px 20px'}}><div style={{fontSize:11,color:'#6b7280',fontWeight:600,textTransform:'uppercase',marginBottom:6}}>Pendiente total</div><div style={{fontSize:24,fontWeight:700,color:'#b45309'}}>{invoices.filter(i=>i.status==='pendiente').reduce((s,i)=>s+i.amount,0)}€</div></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:18}}>
        <div style={cs.card}>
          <div style={{fontWeight:600,fontSize:14,marginBottom:18}}>Ingresos últimos 6 meses</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:10,height:130}}>
            {data.map((d,i)=>(
              <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
                {d.total>0&&<div style={{fontSize:10,color:'#9ca3af'}}>{d.total}€</div>}
                <div style={{width:'100%',display:'flex',flexDirection:'column',height:`${Math.max(Math.round((d.total/maxV)*110),d.total?4:0)}px`}}>
                  {d.pend>0&&<div style={{flex:d.pend,background:'#fef9c3',border:'1px solid #fde047',borderRadius:'4px 4px 0 0'}}/>}
                  {d.paid>0&&<div style={{flex:d.paid,background:i===5?'#1d4ed8':'#dbeafe',borderRadius:d.pend>0?0:'4px 4px 0 0'}}/>}
                </div>
                <div style={{fontSize:11,color:'#6b7280'}}>{d.label}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:14,marginTop:10}}>
            <div style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:10,height:10,background:'#1d4ed8',borderRadius:2}}/><span style={{fontSize:11,color:'#6b7280'}}>Cobrado</span></div>
            <div style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:10,height:10,background:'#fef9c3',border:'1px solid #fde047',borderRadius:2}}/><span style={{fontSize:11,color:'#6b7280'}}>Pendiente</span></div>
          </div>
        </div>
        <div style={cs.card}>
          <div style={{fontWeight:600,fontSize:14,marginBottom:18}}>Métodos de pago</div>
          {Object.entries(methods).length===0?<p style={{fontSize:13,color:'#9ca3af'}}>Sin datos</p>:Object.entries(methods).map(([k,v])=>{const pct=Math.round((v/mt)*100);return(
            <div key={k} style={{marginBottom:14}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:5}}><span style={{textTransform:'capitalize'}}>{k}</span><span style={{color:mc[k]||'#374151',fontWeight:500}}>{v}€ ({pct}%)</span></div>
              <div style={{height:6,background:'#f3f4f6',borderRadius:3}}><div style={{height:'100%',width:`${pct}%`,background:mc[k]||'#374151',borderRadius:3}}/></div>
            </div>
          )})}
        </div>
      </div>
      <div style={{...cs.card,padding:0,overflow:'hidden'}}>
        <div style={{padding:'16px 20px',fontWeight:600,fontSize:14,borderBottom:'1px solid #f3f4f6'}}>Resumen mensual</div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead><tr style={{borderBottom:'1px solid #f3f4f6'}}>{['Mes','Cobrado','Pendiente','Tasa de cobro'].map(h=><th key={h} style={{padding:'10px 16px',textAlign:'left',fontSize:11,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',fontWeight:600}}>{h}</th>)}</tr></thead>
          <tbody>{[...data].reverse().map((d,i)=>{const rate=d.total>0?Math.round((d.paid/d.total)*100):100;return(
            <tr key={i} style={{borderBottom:'1px solid #f9fafb'}}>
              <td style={{padding:'12px 16px',fontWeight:500}}>{d.label}</td>
              <td style={{padding:'12px 16px',color:'#16a34a',fontWeight:500}}>{d.paid}€</td>
              <td style={{padding:'12px 16px',color:d.pend>0?'#b45309':'#9ca3af'}}>{d.pend>0?`${d.pend}€`:'—'}</td>
              <td style={{padding:'12px 16px'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{flex:1,height:4,background:'#f3f4f6',borderRadius:2}}><div style={{height:'100%',width:`${rate}%`,background:rate===100?'#16a34a':rate>70?'#b45309':'#dc2626',borderRadius:2}}/></div>
                  <span style={{fontSize:12,color:'#6b7280',minWidth:34}}>{rate}%</span>
                </div>
              </td>
            </tr>
          )})}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── RECORDATORIOS ──
function Recordatorios({appointments,patients}) {
  const [mPat,setMPat]=useState(''); const [mDate,setMDate]=useState(''); const [mTime,setMTime]=useState('10:00'); const [mDur,setMDur]=useState('50'); const [mMsg,setMMsg]=useState('')
  const [copied,setCopied]=useState({})
  const tom=new Date();tom.setDate(tom.getDate()+1)
  const tomStr=tom.toISOString().split('T')[0]
  const tomLabel=tom.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})
  const aptsTom=appointments.filter(a=>a.date===tomStr).sort((a,b)=>a.time.localeCompare(b.time))
  function wa(nombre,dayL,time,dur){return`Hola ${nombre} 👋\n\nTe escribo para recordarte que mañana, ${dayL}, tenemos sesión a las *${time}h* (${dur} minutos).\n\nRecuerda que la sesión es online — te envío el enlace unos minutos antes.\n\nSi necesitas cambiar o cancelar la cita, avísame con al menos 24 horas de antelación.\n\n¡Hasta mañana! 😊\nJaime`}
  function em(nombre,dayL,time,dur){return`Asunto: Recordatorio de sesión – mañana ${dayL} a las ${time}h\n\nHola ${nombre},\n\nTe escribo para recordarte que mañana, ${dayL}, tenemos sesión de psicología a las ${time}h (${dur} min de duración).\n\nLa sesión se realizará online. Te enviaré el enlace de acceso a la videollamada unos minutos antes.\n\nSi necesitas modificar o cancelar la cita, te pido que me lo comuniques con al menos 24 horas de antelación.\n\nQuedo a tu disposición.\n\nUn saludo,\nJaime\nPsicoJaime – Consulta de Psicología Online`}
  function copy(text,key){
    navigator.clipboard.writeText(text).catch(()=>{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta)})
    setCopied(p=>({...p,[key]:true}));setTimeout(()=>setCopied(p=>({...p,[key]:false})),2000)
  }
  function genManual(){const p=patients.find(x=>x.id===Number(mPat));if(!p||!mDate)return;const d=new Date(mDate+'T00:00:00');const label=d.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});setMMsg(wa(p.nombre.split(' ')[0],label,mTime,mDur))}
  const MsgBox=({text,id})=>(
    <div>
      <div style={{background:'#f9fafb',borderRadius:8,padding:'12px 14px',fontSize:13,whiteSpace:'pre-wrap',lineHeight:1.6,marginBottom:8,color:'#374151'}}>{text}</div>
      <Btn size="sm" variant={copied[id]?'success':'default'} onClick={()=>copy(text,id)}>{copied[id]?'✓ Copiado':'📋 Copiar'}</Btn>
    </div>
  )
  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:700,marginBottom:4}}>Recordatorios de sesión</h2>
      <p style={{fontSize:13,color:'#6b7280',marginBottom:24}}>Mensajes listos para copiar y enviar a tus pacientes</p>
      <div style={{...cs.card,marginBottom:22}}>
        <div style={{fontWeight:600,fontSize:15,marginBottom:4}}>📅 Citas de mañana — {tomLabel}</div>
        <p style={{fontSize:13,color:'#6b7280',marginBottom:18}}>{aptsTom.length} cita{aptsTom.length!==1?'s':''} programada{aptsTom.length!==1?'s':''}</p>
        {aptsTom.length===0&&<div style={{background:'#f9fafb',borderRadius:8,padding:20,textAlign:'center',fontSize:13,color:'#9ca3af'}}>No hay sesiones programadas para mañana</div>}
        {aptsTom.map(a=>{const nombre=a.patient.split(' ')[0];return(
          <div key={a.id} style={{border:'1px solid #e5e7eb',borderRadius:10,padding:18,marginBottom:14}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
              <Avatar name={a.patient} size={34}/>
              <div><div style={{fontWeight:600,fontSize:14}}>{a.patient}</div><div style={{fontSize:12,color:'#9ca3af'}}>{a.time}h · {a.duration}min</div></div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:12,fontWeight:600,color:'#374151',marginBottom:6}}>📱 WhatsApp / SMS</div>
              <MsgBox text={wa(nombre,tomLabel,a.time,a.duration)} id={`wa-${a.id}`}/>
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:600,color:'#374151',marginBottom:6}}>📧 Email</div>
              <MsgBox text={em(nombre,tomLabel,a.time,a.duration)} id={`em-${a.id}`}/>
            </div>
          </div>
        )})}
      </div>
      <div style={cs.card}>
        <div style={{fontWeight:600,fontSize:15,marginBottom:4}}>✍️ Recordatorio manual</div>
        <p style={{fontSize:13,color:'#6b7280',marginBottom:18}}>Para cualquier paciente y fecha</p>
        <G2><Sel label="Paciente" value={mPat} onChange={e=>setMPat(e.target.value)}><option value="">Seleccionar…</option>{patients.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}</Sel><Inp label="Fecha de la sesión" type="date" value={mDate} onChange={e=>setMDate(e.target.value)}/></G2>
        <G2><Inp label="Hora" type="time" value={mTime} onChange={e=>setMTime(e.target.value)}/><Inp label="Duración (min)" type="number" value={mDur} onChange={e=>setMDur(e.target.value)}/></G2>
        <Btn variant="primary" onClick={genManual}>⚡ Generar mensaje</Btn>
        {mMsg&&<div style={{marginTop:16}}><MsgBox text={mMsg} id="manual"/></div>}
      </div>
    </div>
  )
}

// ── SIDEBAR ──
function Sidebar({section,onNav,onLogout}) {
  const items=[{id:'dashboard',icon:'📊',label:'Dashboard'},{id:'pacientes',icon:'👤',label:'Pacientes'},{id:'agenda',icon:'📅',label:'Agenda'},{id:'facturacion',icon:'🧾',label:'Facturación'},{id:'finanzas',icon:'📈',label:'Finanzas'},{id:'recordatorios',icon:'💬',label:'Recordatorios'}]
  return (
    <div style={{width:210,background:'#fff',borderRight:'1px solid #e5e7eb',display:'flex',flexDirection:'column',flexShrink:0,position:'sticky',top:0,height:'100vh'}}>
      <div style={{padding:'22px 18px 18px',borderBottom:'1px solid #f3f4f6'}}>
        <div style={{fontSize:18,fontWeight:700,color:'#111827'}}>🧠 PsicoJaime</div>
        <div style={{fontSize:11,color:'#9ca3af',marginTop:3}}>Consulta de Psicología Online</div>
      </div>
      <nav style={{padding:'14px 10px',flex:1}}>
        {items.map(({id,icon,label})=>(
          <button key={id} onClick={()=>onNav(id)} style={{width:'100%',display:'flex',alignItems:'center',gap:9,padding:'9px 12px',borderRadius:8,border:'none',background:section===id?'#eff6ff':'transparent',color:section===id?'#1d4ed8':'#6b7280',fontWeight:section===id?600:400,cursor:'pointer',fontSize:13,fontFamily:'inherit',marginBottom:2,textAlign:'left'}}>
            <span style={{fontSize:15}}>{icon}</span>{label}
            {section===id&&<div style={{marginLeft:'auto',width:6,height:6,borderRadius:'50%',background:'#1d4ed8'}}/>}
          </button>
        ))}
      </nav>
      <div style={{padding:'14px 18px',borderTop:'1px solid #f3f4f6'}}>
        <div style={{fontSize:12,color:'#374151',fontWeight:500,marginBottom:8}}>Jaime · Psicólogo</div>
        <button onClick={onLogout} style={{fontSize:12,color:'#9ca3af',background:'none',border:'none',cursor:'pointer',padding:0}}>🔒 Cerrar sesión</button>
      </div>
    </div>
  )
}

// ── ROOT ──
export default function App() {
  const [session,setSession]=useState(()=>loadSession())
  const [section,setSection]=useState('dashboard')
  const [patients,setPatients]=useState(()=>loadData('patients',DEMO_PATIENTS))
  const [invoices,setInvoices]=useState(()=>loadData('invoices',DEMO_INVOICES))
  const [appointments,setAppointments]=useState(()=>loadData('appointments',DEMO_APPOINTMENTS))
  const [toast,setToast]=useState('')

  useEffect(()=>{saveData('patients',patients)},[patients])
  useEffect(()=>{saveData('invoices',invoices)},[invoices])
  useEffect(()=>{saveData('appointments',appointments)},[appointments])

  function showToast(msg){setToast(msg);setTimeout(()=>setToast(''),2500)}
  function handleLogin(user){saveSession(user);setSession({user})}
  function handleLogout(){clearSession();setSession(null)}

  if(!session) return <Login onLogin={handleLogin}/>

  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <Sidebar section={section} onNav={setSection} onLogout={handleLogout}/>
      <main style={{flex:1,overflowY:'auto',padding:36}}>
        {section==='dashboard'&&<Dashboard patients={patients} invoices={invoices} appointments={appointments} onNav={setSection}/>}
        {section==='pacientes'&&<Patients patients={patients} setPatients={setPatients} onToast={showToast}/>}
        {section==='agenda'&&<Agenda appointments={appointments} setAppointments={setAppointments} patients={patients} onToast={showToast}/>}
        {section==='facturacion'&&<Facturacion invoices={invoices} setInvoices={setInvoices} patients={patients} onToast={showToast}/>}
        {section==='finanzas'&&<Finanzas invoices={invoices}/>}
        {section==='recordatorios'&&<Recordatorios appointments={appointments} patients={patients}/>}
      </main>
      <Toast msg={toast}/>
    </div>
  )
}
