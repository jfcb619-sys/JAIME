import React from 'react'

export function Btn({ children, variant = 'default', onClick, style = {}, disabled = false, size = 'md', type = 'button' }) {
  const vs = {
    default:  { background: '#fff',     border: '1px solid #d1d5db', color: '#374151' },
    primary:  { background: '#1e3a6e',  border: '1px solid #1e3a6e', color: '#fff' },
    success:  { background: '#dcfce7',  border: '1px solid #86efac', color: '#166534' },
    danger:   { background: '#fee2e2',  border: '1px solid #fca5a5', color: '#991b1b' },
    warning:  { background: '#fef9c3',  border: '1px solid #fde047', color: '#854d0e' },
    info:     { background: '#dbeafe',  border: '1px solid #93c5fd', color: '#1e40af' },
    ghost:    { background: 'transparent', border: '1px solid #e5e7eb', color: '#6b7280' },
  }
  const sz = { sm: '5px 11px', md: '8px 16px', lg: '11px 22px' }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...vs[variant], padding: sz[size], borderRadius: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: size === 'sm' ? 11 : 13, fontWeight: 500,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'inherit', opacity: disabled ? 0.55 : 1,
      transition: 'opacity .15s, box-shadow .15s', ...style,
    }}>
      {children}
    </button>
  )
}

export function Badge({ children, variant = 'default', style = {} }) {
  const vs = {
    default: { background: '#f3f4f6', color: '#374151' },
    success: { background: '#dcfce7', color: '#166534' },
    danger:  { background: '#fee2e2', color: '#991b1b' },
    warning: { background: '#fef9c3', color: '#854d0e' },
    info:    { background: '#dbeafe', color: '#1e40af' },
    purple:  { background: '#ede9fe', color: '#6b21a8' },
  }
  return <span style={{ ...vs[variant], padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500, display: 'inline-block', ...style }}>{children}</span>
}

export function Card({ children, style = {}, noPad = false }) {
  return <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: noPad ? 0 : 20, ...style }}>{children}</div>
}

export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 5 }}>{label}</label>}
      {children}
    </div>
  )
}

const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, color: '#111827', background: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }

export function Input({ label, ...props }) {
  return <Field label={label}><input {...props} style={{ ...inputStyle, ...props.style }} /></Field>
}

export function Select({ label, children, ...props }) {
  return <Field label={label}><select {...props} style={{ ...inputStyle, ...props.style }}>{children}</select></Field>
}

export function Textarea({ label, ...props }) {
  return <Field label={label}><textarea {...props} style={{ ...inputStyle, resize: 'vertical', minHeight: 80, ...props.style }} /></Field>
}

export function Modal({ title, onClose, children, footer, maxWidth = 600 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, width: '100%', maxWidth, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
        {footer && <div style={{ padding: '14px 22px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: 10, position: 'sticky', bottom: 0, background: '#fff' }}>{footer}</div>}
      </div>
    </div>
  )
}

export function SectionTitle({ children, style = {} }) {
  return <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600, borderBottom: '1px solid #f3f4f6', paddingBottom: 7, marginBottom: 14, marginTop: 20, ...style }}>{children}</div>
}

export function Avatar({ name = '?', size = 38 }) {
  const palette = [
    ['#dbeafe','#1e40af'], ['#dcfce7','#166534'], ['#ede9fe','#6b21a8'],
    ['#fef9c3','#854d0e'], ['#fee2e2','#991b1b'], ['#f0fdf4','#14532d'],
    ['#fff7ed','#9a3412'], ['#fdf2f8','#86198f'],
  ]
  const [bg, fg] = palette[(name.charCodeAt(0) || 0) % palette.length]
  return <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 700, flexShrink: 0 }}>{name[0]?.toUpperCase()}</div>
}

export function PageHeader({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{title}</h2>
        {sub && <p style={{ fontSize: 13, color: '#6b7280' }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function MetricCard({ label, value, sub, color = '#1e3a6e' }) {
  return (
    <Card style={{ padding: '18px 20px' }}>
      <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, marginBottom: 3 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#9ca3af' }}>{sub}</div>}
    </Card>
  )
}
